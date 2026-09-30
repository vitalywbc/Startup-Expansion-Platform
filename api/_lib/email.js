// Sends an email through Resend. Returns true on success; never throws.
export async function sendEmail({ to, subject, text, replyTo }) {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env
  if (!RESEND_API_KEY) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: EMAIL_FROM || 'Startup Expansion Platform <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
