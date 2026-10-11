import Stripe from 'stripe'
import { supabaseAdmin } from './_lib/supabaseAdmin.js'
import { sendEmail } from './_lib/email.js'
import { verdictFromScores, SCORE_COLUMNS } from './_lib/verdict.js'
import { CREDIT_WINDOW_DAYS } from './_lib/credit.js'

// Web-standard handler: gives the untouched raw body that Stripe's signature check needs.
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const RETURNING = ['company_name', 'contact_name', 'contact_email', 'country', 'sector', 'source', 'paid', ...SCORE_COLUMNS].join(', ')

export async function POST(request) {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env
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

  // Sessions created before the plan existed carry product 'france_readiness_assessment',
  // so anything that is not explicitly the plan is handled as an assessment.
  return session.metadata?.product === 'plan' ? handlePlan(session, id) : handleAssessment(session, id)
}

async function handleAssessment(session, id) {
  const { ADMIN_EMAIL, SITE_URL } = process.env
  const db = supabaseAdmin()

  // Only the first delivery flips paid=false → true, so retries don't send duplicate emails.
  const { data: rows, error } = await db
    .from('submissions')
    .update({ paid: true, paid_at: new Date().toISOString(), stripe_session_id: session.id, amount_paid: session.amount_total })
    .eq('id', id).eq('paid', false)
    .select(RETURNING)

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

  // The plan is only offered where the verdict allows it, so the upgrade link goes
  // out only to the clients who can actually act on it.
  const site = SITE_URL || 'https://expansion.verynta.com'
  const upgrade = verdictFromScores(row) === 'validation'
    ? ''
    : `\n\nWant the full France entry plan? Your €39 counts toward it for ${CREDIT_WINDOW_DAYS} days: ${site}/france/upgrade?sid=${id}`

  const to = session.customer_details?.email || row.contact_email
  if (to) {
    await sendEmail({
      to,
      replyTo: ADMIN_EMAIL,
      subject: 'Your Verynta France readiness assessment',
      text: `Hello ${row.contact_name || ''},\n\nThank you for your order. Your sector questionnaire for ${row.company_name} will arrive by email within 2 business days. Once you send your answers, your readiness profile follows within 5 business days.${upgrade}\n\nYour invoice comes separately from Stripe.\n\nVerynta\nhello@verynta.com`,
    })
  }
  return json({ received: true })
}

async function handlePlan(session, id) {
  const { ADMIN_EMAIL } = process.env
  const db = supabaseAdmin()
  const now = new Date().toISOString()

  // Only the first delivery flips plan_paid=false → true, so retries don't send duplicate emails.
  const { data: rows, error } = await db
    .from('submissions')
    .update({ plan_paid: true, plan_paid_at: now, plan_amount_paid: session.amount_total, plan_stripe_session_id: session.id })
    .eq('id', id).eq('plan_paid', false)
    .select(RETURNING)

  if (error) {
    console.error('Supabase plan update failed', error.message)
    return json({ error: 'update failed' }, 500)
  }
  const row = rows?.[0]
  if (!row) return json({ received: true, duplicate: true })

  // The plan includes the assessment, so a plan bought on its own unlocks it too.
  // The amount stays in plan_amount_paid: no separate assessment payment was made.
  if (row.paid === false) {
    await db.from('submissions').update({ paid: true, paid_at: now }).eq('id', id).eq('paid', false)
  }

  // A credit can only be spent once, so the assessment it came from is marked here, where
  // the money has actually arrived. A Stripe retry cannot repair a failure: the plan update
  // above already short-circuits as a duplicate. So the warning goes into the admin email,
  // which is the only place left that a person reads.
  const creditFrom = session.metadata?.credit_from_submission
  let creditWarning = ''
  if (creditFrom) {
    const { error: creditError } = await db
      .from('submissions').update({ credit_used: true }).eq('id', creditFrom)
    if (creditError) {
      console.error('Marking the assessment credit as used failed', creditError.message)
      creditWarning = `\n\nWARNING: credit_used not set for submission ${creditFrom} — set it by hand, or the €39 credit can be spent twice.`
    }
  }

  const total = (session.amount_total / 100).toFixed(2)
  if (ADMIN_EMAIL) {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `PAID PLAN €${total} — ${row.company_name} (${row.country})`,
      text: `Paid France entry plan (assessment included)\n\nCompany: ${row.company_name}\nCountry: ${row.country}\nSector: ${row.sector}\nContact: ${row.contact_name} <${row.contact_email}>\nSource: ${row.source}\nAmount: €${total} (incl. any VAT, after any assessment credit)\nSubmission: ${id}\nStripe session: ${session.id}\n\nNext: send the plan brief within 2 business days.${creditWarning}`,
    })
  }

  const to = session.customer_details?.email || row.contact_email
  if (to) {
    await sendEmail({
      to,
      replyTo: ADMIN_EMAIL,
      subject: 'Your Verynta France entry plan',
      text: `Hello ${row.contact_name || ''},\n\nThank you for your order. Your France entry plan for ${row.company_name} starts with a brief: the questions arrive by email within 2 business days. Your plan is delivered within 5 business days of receiving your completed brief.\n\nThe readiness assessment is included in the plan.\n\nYour invoice comes separately from Stripe.\n\nVerynta\nhello@verynta.com`,
    })
  }
  return json({ received: true })
}
