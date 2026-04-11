export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { RESEND_API_KEY, ADMIN_EMAIL } = process.env
  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    return res.status(500).json({ error: 'Email service not configured' })
  }

  const data = req.body

  const subject = `New intake submission — ${data.company_name || 'Unknown'} · ${data.source || 'direct'}`

  const body = `
New Startup Intake Submission
=============================

Source: ${data.source}
Submitted: ${new Date().toISOString()}

COMPANY PROFILE
Company: ${data.company_name}
Country: ${data.country}
Sector: ${data.sector}
Employees: ${data.employees}
Revenue: ${data.revenue}
International revenue: ${data.intl_revenue}

INTERNATIONAL EXPANSION
Expansion experience: ${data.expansion_exp}
France drivers: ${(data.france_drivers || []).join(', ')}
Alternative countries: ${(data.gateway_countries || []).join(', ')}
Timeline: ${data.timeline}

SUPPORT NEEDED
Support types: ${(data.support_needed || []).join(', ')}
Main concern: ${data.main_concern}
France connections: ${data.france_connections}

CONTACT
Name: ${data.contact_name}
Email: ${data.contact_email}
WhatsApp/LinkedIn: ${data.contact_alt || '—'}

PRELIMINARY SCORES
Market validation: ${data.score_market}/100
International maturity: ${data.score_intl}/100
France intent clarity: ${data.score_intent}/100
Network & connections: ${data.score_network}/100
Expansion readiness: ${data.score_readiness}/100
`.trim()

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Startup Expansion Platform <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject,
        text: body,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(500).json({ error: 'Email send failed', details: err })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ error: 'Email send failed', message: error.message })
  }
}
