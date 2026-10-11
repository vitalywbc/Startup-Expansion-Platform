import { normalizeEmail } from './email.js'

export const CREDIT_WINDOW_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

// The €39 credit follows the buyer, not one submission: a client who ran the intake twice
// still has one paid assessment to count, and it can only be spent once. Returns the
// assessment that pays for the credit, or null when nothing qualifies.
//
// Candidates are filtered in SQL down to paid assessments inside the window that are still
// unspent, then matched on the email in JS, because the comparison has to be trimmed as well
// as case-insensitive and PostgREST cannot express that. The window keeps the set small; if
// paid volume ever makes it large, move the match into a SQL view on lower(trim(contact_email)).
export async function findAssessmentCredit(db, email) {
  const wanted = normalizeEmail(email)
  if (!wanted) return null

  const since = new Date(Date.now() - CREDIT_WINDOW_DAYS * DAY_MS).toISOString()
  const { data, error } = await db
    .from('submissions')
    .select('id, contact_email, paid_at')
    .eq('paid', true)
    .not('credit_used', 'is', true)
    .gte('paid_at', since)
    .order('paid_at', { ascending: true })
    .limit(500)

  if (error || !data?.length) return null

  // Oldest first: the credit closest to expiry is the one spent.
  const match = data.find((row) => normalizeEmail(row.contact_email) === wanted)
  if (!match) return null

  const elapsed = (Date.now() - Date.parse(match.paid_at)) / DAY_MS
  if (!Number.isFinite(elapsed) || elapsed >= CREDIT_WINDOW_DAYS) return null

  return { submission_id: match.id, days_left: Math.max(1, Math.ceil(CREDIT_WINDOW_DAYS - elapsed)) }
}
