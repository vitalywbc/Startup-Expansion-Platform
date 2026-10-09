import Stripe from 'stripe'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SITE_URL } = process.env
  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) return res.status(500).json({ error: 'Payments not configured' })

  const { submission_id, email } = req.body || {}
  if (!UUID_RE.test(submission_id || '')) return res.status(400).json({ error: 'Invalid submission' })

  // The submission must exist and not be paid already.
  try {
    const { data, error } = await supabaseAdmin()
      .from('submissions').select('id, paid, contact_email').eq('id', submission_id).maybeSingle()
    if (error || !data) return res.status(404).json({ error: 'Submission not found' })
    if (data.paid) return res.status(409).json({ error: 'Already paid' })
  } catch (e) {
    return res.status(500).json({ error: 'Lookup failed' })
  }

  const origin = SITE_URL || `https://${req.headers.host}`
  const stripe = new Stripe(STRIPE_SECRET_KEY)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      client_reference_id: submission_id,
      metadata: { submission_id, product: 'france_readiness_assessment' },
      customer_email: typeof email === 'string' && email.includes('@') ? email : undefined,
      customer_creation: 'always',
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      invoice_creation: { enabled: true },
      allow_promotion_codes: true,
      locale: 'en',
      success_url: `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/france/result?cancelled=1`,
    })
    return res.status(200).json({ url: session.url })
  } catch (e) {
    console.error('Stripe session error', e.message)
    return res.status(500).json({ error: 'Checkout unavailable' })
  }
}
