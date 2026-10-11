import Stripe from 'stripe'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { verdictFromScores, SCORE_COLUMNS } from './_lib/verdict.js'
import { findAssessmentCredit } from './_lib/credit.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// What the plan costs this submission right now. The credit follows the buyer's email, but
// the email is never taken from the request: it is read from the submission the id names, so
// a caller cannot probe for other people's paid assessments. Prices come from Stripe, so the
// page cannot quote a figure the checkout will not honour.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID_PLAN, STRIPE_COUPON_ASSESSMENT_CREDIT } = process.env
  const sid = req.query?.sid
  if (!UUID_RE.test(sid || '')) return res.status(400).json({ error: 'Invalid submission' })
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID_PLAN) return res.status(500).json({ error: 'Payments not configured' })

  let db
  let row
  let credit = null
  try {
    db = supabaseAdmin()
    const columns = ['company_name', 'contact_email', 'plan_paid', ...SCORE_COLUMNS].join(', ')
    const { data, error } = await db.from('submissions').select(columns).eq('id', sid).maybeSingle()
    if (error || !data) return res.status(404).json({ error: 'Submission not found' })
    row = data
    if (STRIPE_COUPON_ASSESSMENT_CREDIT) credit = await findAssessmentCredit(db, row.contact_email)
  } catch (e) {
    console.error('Credit lookup failed', e.message)
    return res.status(500).json({ error: 'Lookup failed' })
  }

  let amount_cents
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY)
    const price = await stripe.prices.retrieve(STRIPE_PRICE_ID_PLAN)
    amount_cents = price.unit_amount
    if (credit) {
      const coupon = await stripe.coupons.retrieve(STRIPE_COUPON_ASSESSMENT_CREDIT)
      amount_cents = Math.max(0, amount_cents - (coupon.amount_off || 0))
    }
  } catch (e) {
    console.error('Stripe price lookup failed', e.message)
    return res.status(500).json({ error: 'Quote unavailable' })
  }

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    eligible: Boolean(credit),
    amount_cents,
    days_left: credit?.days_left ?? 0,
    // Not part of the credit answer: whether the plan can be ordered for this submission at
    // all. The pages need it to stay off a checkout the server would refuse anyway.
    plan_available: !row.plan_paid && verdictFromScores(row) !== 'validation',
    company: row.company_name,
  })
}
