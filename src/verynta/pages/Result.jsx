import { useState } from 'react'
import { getScoreLabel } from '../../lib/scoring'
import Gauge, { HEADLINES, verdictFromScores } from '../Gauge'
import { Header, Footer } from '../Layout'
import { Link } from '../router'

const DIMENSIONS = [
  ['score_market', 'Market validation'],
  ['score_intl', 'International maturity'],
  ['score_intent', 'France intent clarity'],
  ['score_network', 'Network and connections'],
  ['score_readiness', 'Expansion readiness'],
]

function readResult() {
  try { return JSON.parse(sessionStorage.getItem('vy_result')) } catch { return null }
}

export default function Result() {
  const [result] = useState(readResult)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [alreadyPaid, setAlreadyPaid] = useState(false)
  const [businessConfirmed, setBusinessConfirmed] = useState(false)
  const cancelled = new URLSearchParams(window.location.search).get('cancelled')

  if (!result) {
    return (
      <div className="vy-app">
        <Header market="France" />
        <main className="vy-wrap vy-narrow vy-section">
          <h1 className="vy-h2">Your result isn't available in this browser</h1>
          <p className="vy-body">Results are kept only in the browser where you completed the intake. Start the intake again to see your position.</p>
          <Link to="/france/intake" className="vy-btn">Start the free intake</Link>
        </main>
      </div>
    )
  }

  const verdict = verdictFromScores(result.scores)

  async function checkout() {
    if (!businessConfirmed) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: result.id, email: result.email, business_purchase: businessConfirmed }),
      })
      if (res.status === 409) {
        setAlreadyPaid(true)
        setLoading(false)
        return
      }
      const body = await res.json()
      if (!res.ok || !body.url) throw new Error(body.error || 'Checkout unavailable')
      window.location.href = body.url
    } catch (e) {
      setError('The payment page could not be opened. Try again in a minute, or write to hello@verynta.com.')
      setLoading(false)
    }
  }

  return (
    <div className="vy-app">
      <Header market="France" />
      <main className="vy-wrap vy-narrow">
        <section className="vy-result-head">
          <p className="vy-muted-strong">{result.company_name}, your preliminary position</p>
          <h1 className="vy-h1">{HEADLINES[verdict]}</h1>
          <Gauge verdict={verdict} compact />
          <p className="vy-body">Based on your intake answers only. The full assessment tests this against the barriers specific to your sector.</p>
        </section>

        <section className="vy-card vy-drivers">
          <h2 className="vy-h4">What drives it</h2>
          {DIMENSIONS.map(([key, name]) => {
            const val = result.scores?.[key] ?? 0
            return (
              <div className="vy-driver" key={key}>
                <div className="vy-driver__head"><span>{name}</span><strong>{getScoreLabel(val)}</strong></div>
                <div className="vy-driver__track"><div className="vy-driver__fill" style={{ width: `${val}%` }} /></div>
              </div>
            )
          })}
        </section>

        <section className="vy-buy">
          <h2 className="vy-h3">Get the full verdict</h2>
          <ul className="vy-signals">
            <li><span className="vy-dot vy-dot--ready" />14 questions written for your sector and product</li>
            <li><span className="vy-dot vy-dot--ready" />A scored readiness profile with the French barriers that apply to you</li>
            <li><span className="vy-dot vy-dot--ready" />What to fix first, reviewed personally, within 5 business days of your answers</li>
          </ul>
          {alreadyPaid ? (
            <p className="vy-note" role="status">This assessment is already paid. Your questionnaire will arrive by email.</p>
          ) : (
            <>
              {cancelled && <p className="vy-note">Payment was not completed. You can try again below.</p>}
              <label className="vy-check">
                <input type="checkbox" checked={businessConfirmed} onChange={(e) => setBusinessConfirmed(e.target.checked)} />
                <span>I am purchasing on behalf of a company or as a self-employed professional, for business purposes.</span>
              </label>
              <button type="button" className="vy-btn vy-btn--block vy-btn--large" onClick={checkout} disabled={loading || !businessConfirmed}>
                {loading ? 'Opening secure payment…' : 'Get the full assessment for €39'}
              </button>
              {error && <p className="vy-error" role="alert">{error}</p>}
            </>
          )}
          <p className="vy-fine">€39 excl. VAT; VAT is added only where it applies. Secure payment by Stripe. For businesses only. See the <Link to="/legal/cgv">terms of sale</Link>.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
