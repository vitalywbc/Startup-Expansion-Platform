import Stripe from 'stripe'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { sendEmail } from './_lib/email.js'

// Web-standard handler: gives the untouched raw body that Stripe's signature check needs.
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export async function POST(request) {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ADMIN_EMAIL } = process.env
  const stripe = new Stripe(STRIPE_SECRET_KEY)

  let event
  try {
    const raw = await request.text()
    event = await stripe.webhooks.constructEventAsync(raw, request.headers.get('stripe-signature'), STRIPE_WEBHOOK_SECRET)
  } catch (e) {
    return new Response(`Webhook signature error: ${e.message}`, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') return json({ received: true })

  const session = event.data.object
  const id = session.client_reference_id
  if (!id || session.payment_status !== 'paid') return json({ received: true })

  const db = supabaseAdmin()
  // Only the first delivery flips paid=false → true, so retries don't send duplicate emails.
  const { data: rows, error } = await db
    .from('submissions')
    .update({ paid: true, paid_at: new Date().toISOString(), stripe_session_id: session.id, amount_paid: session.amount_total })
    .eq('id', id).eq('paid', false)
    .select('company_name, contact_name, contact_email, country, sector, source')

  if (error) {
    console.error('Supabase update failed', error.message)
    return json({ error: 'update failed' }, 500)
  }
  const row = rows?.[0]
  if (!row) return json({ received: true, duplicate: true })

  const total = (session.amount_total / 100).toFixed(2)
  if (ADMIN_EMAIL) {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `PAID €${total} — ${row.company_name} (${row.country})`,
      text: `Paid readiness assessment\n\nCompany: ${row.company_name}\nCountry: ${row.country}\nSector: ${row.sector}\nContact: ${row.contact_name} <${row.contact_email}>\nSource: ${row.source}\nAmount: €${total} (incl. any VAT)\nSubmission: ${id}\nStripe session: ${session.id}\n\nNext: send the sector questionnaire within 2 business days.`,
    })
  }
  const to = session.customer_details?.email || row.contact_email
  if (to) {
    await sendEmail({
      to,
      replyTo: ADMIN_EMAIL,
      subject: 'Your Verynta France readiness assessment',
      text: `Hello ${row.contact_name || ''},\n\nThank you for your order. Your sector questionnaire for ${row.company_name} will arrive by email within 2 business days. Once you send your answers, your readiness profile follows within 5 business days.\n\nYour invoice comes separately from Stripe.\n\nVerynta\nhello@verynta.com`,
    })
  }
  return json({ received: true })
}
