import Stripe from 'stripe'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { verdictFromScores, SCORE_COLUMNS } from './_lib/verdict.js'
import { findAssessmentCredit } from './_lib/credit.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Which env var holds the Stripe price for each product the site sells.
const PRICE_ENV = { assessment: 'STRIPE_PRICE_ID', plan: 'STRIPE_PRICE_ID_PLAN' }

const asEmail = (v) => (typeof v === 'string' && v.includes('@') ? v : undefined)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { STRIPE_SECRET_KEY, STRIPE_COUPON_ASSESSMENT_CREDIT, SITE_URL } = process.env
  const { submission_id, email, business_purchase, product } = req.body || {}

  if (!PRICE_ENV[product]) return res.status(400).json({ error: 'Invalid product' })
  if (!UUID_RE.test(submission_id || '')) return res.status(400).json({ error: 'Invalid submission' })
  if (business_purchase !== true) return res.status(400).json({ error: 'Business purchase confirmation required' })

  const price = process.env[PRICE_ENV[product]]
  if (!STRIPE_SECRET_KEY || !price) return res.status(500).json({ error: 'Payments not configured' })

  // The submission must exist and must not already be paid for this product.
  let db
  let row
  try {
    db = supabaseAdmin()
    const columns = ['id', 'paid', 'plan_paid', 'contact_email', ...SCORE_COLUMNS].join(', ')
    const { data, error } = await db
      .from('submissions').select(columns).eq('id', submission_id).maybeSingle()
    if (error || !data) return res.status(404).json({ error: 'Submission not found' })
    row = data
  } catch (e) {
    return res.status(500).json({ error: 'Lookup failed' })
  }

  if (product === 'assessment' && row.paid) return res.status(409).json({ error: 'Already paid' })
  if (product === 'plan') {
    if (row.plan_paid) return res.status(409).json({ error: 'Plan already paid' })
    // The result page hides the plan card for validation verdicts; this is the same rule
    // applied where it cannot be skipped by posting straight to the endpoint.
    if (verdictFromScores(row) === 'validation') return res.status(403).json({ error: 'Plan not available for this position' })
  }

  // Eligibility is decided here again, not trusted from the page: any paid assessment on the
  // same email, inside the window and not yet spent, pays for the credit. Stripe refuses
  // `discounts` together with `allow_promotion_codes`, so the credit replaces the promo field;
  // without a credit the promo field stays open for manual codes.
  let credit = null
  if (product === 'plan' && STRIPE_COUPON_ASSESSMENT_CREDIT) {
    try {
      credit = await findAssessmentCredit(db, row.contact_email)
    } catch (e) {
      console.error('Credit lookup failed', e.message)
    }
  }

  const origin = SITE_URL || `https://${req.headers.host}`
  const stripe = new Stripe(STRIPE_SECRET_KEY)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price, quantity: 1 }],
      client_reference_id: submission_id,
      metadata: {
        submission_id,
        product,
        business_purchase: 'true',
        // The webhook spends this assessment's credit once the plan is actually paid.
        ...(credit ? { credit_from_submission: credit.submission_id } : {}),
      },
      customer_email: asEmail(email) || asEmail(row.contact_email),
      customer_creation: 'always',
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      invoice_creation: { enabled: true },
      ...(credit
        ? { discounts: [{ coupon: STRIPE_COUPON_ASSESSMENT_CREDIT }] }
        : { allow_promotion_codes: true }),
      locale: 'en',
      success_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
      // Only the upgrade page offers a credited plan, so that is where a cancel returns.
      cancel_url: credit
        ? `${origin}/france/upgrade?sid=${submission_id}&cancelled=1`
        : `${origin}/france/result?cancelled=1`,
    })
    return res.status(200).json({ url: session.url })
  } catch (e) {
    console.error('Stripe session error', e.message)
    return res.status(500).json({ error: 'Checkout unavailable' })
  }
}
