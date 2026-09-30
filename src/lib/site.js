// Decides which site to render from the hostname.
// verynta.com (and www.) → Verynta; everything else (vercel.app, localhost) → legacy intake.
// For local testing of the Verynta site, open http://localhost:5173/?site=verynta once;
// the choice is remembered for the browser session.
export function isVerynta() {
  const host = window.location.hostname
  if (host === 'verynta.com' || host.endsWith('.verynta.com')) return true
  const param = new URLSearchParams(window.location.search).get('site')
  try {
    if (param === 'verynta') sessionStorage.setItem('site', 'verynta')
    if (param === 'legacy') sessionStorage.removeItem('site')
    return sessionStorage.getItem('site') === 'verynta'
  } catch {
    return param === 'verynta'
  }
}

export function getChannel() {
  return isVerynta() ? 'direct_paid' : 'creative_valley'
}
