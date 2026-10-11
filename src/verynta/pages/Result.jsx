import { useEffect, useState } from 'react'
import { getScoreLabel } from '../../lib/scoring'
import Gauge, { HEADLINES, verdictFromScores } from '../Gauge'
import { Header, Footer } from '../Layout'
import { Link } from '../router'
import { euros } from '../money'

const DIMENSIONS = [
  ['score_market', 'Market validation'],
  ['score_intl', 'International maturity'],
  ['score_intent', 'France intent clarity'],
  ['score_network', 'Network and connections'],
  ['score_readiness', 'Expansion readiness'],
]

const PLAN_LIST_PRICE_CENTS = 79000

function readResult() {
  try { return JSON.parse(sessionStorage.getItem('vy_result')) } catch { return null }
}

export default function Result() {
  const [result] = useState(readResult)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState(null)
  const [paid, setPaid] = useState({ assessment: false, plan: false })
  const [businessConfirmed, setBusinessConfirmed] = useState(false)
  const [quote, setQuote] = useState(null)
  const cancelled = new URLSearchParams(window.location.search).get('cancelled')

  const verdict = result ? verdictFromScores(result.scores) : null
  // A validation verdict means the plan is premature, so it is not offered. The server
  // applies the same rule, so hiding the card here is presentation, not the gate.
  const planOffered = verdict !== null && verdict !== 'validation'

  // The €39 credit is decided server-side, from the email on this submission. Without the
  // quote the card falls back to the list price, which is what an uncredited buyer pays.
  useEffect(() => {
    if (!result?.id || !planOffered) return undefined
    let live = true
    fetch(`/api/upgrade-quote?sid=${encodeURIComponent(result.id)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => { if (live) setQuote(data) })
      .catch(() => { /* the card keeps the list price */ })
    return () => { live = false }
  }, [result?.id, planOffered])

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

  const planPriceCents = quote?.amount_cents ?? PLAN_LIST_PRICE_CENTS
  const planPrice = euros(planPriceCents)

  async function checkout(product) {
    if (!businessConfirmed || pending) return
    setPending(product)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: result.id, email: result.email, business_purchase: businessConfirmed, product }),
      })
      if (res.status === 409) {
        setPaid((prev) => ({ ...prev, [product]: true }))
        setPending(null)
        return
      }
      const body = await res.json()
      if (!res.ok || !body.url) throw new Error(body.error || 'Checkout unavailable')
      window.location.href = body.url
    } catch (e) {
      setError('The payment page could not be opened. Try again in a minute, or write to hello@verynta.com.')
      setPending(null)
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
          {cancelled && <p className="vy-note">Payment was not completed. You can try again below.</p>}
          <label className="vy-check">
            <input type="checkbox" checked={businessConfirmed} onChange={(e) => setBusinessConfirmed(e.target.checked)} />
            <span>I am purchasing on behalf of a company or as a self-employed professional, for business purposes.</span>
          </label>

          <div className="vy-tiers">
            <div className="vy-card vy-tier vy-tier--main">
              <h3>Readiness assessment</h3>
              <p className="vy-price">€39</p>
              <ul className="vy-signals">
                <li><span className="vy-dot vy-dot--ready" />14 questions written for your sector and product</li>
                <li><span className="vy-dot vy-dot--ready" />A scored readiness profile with the French barriers that apply to you</li>
                <li><span className="vy-dot vy-dot--ready" />What to fix first, reviewed personally, within 5 business days of your answers</li>
              </ul>
              {paid.assessment ? (
                <p className="vy-note" role="status">This assessment is already paid. Your questionnaire will arrive by email.</p>
              ) : (
                <button type="button" className="vy-btn vy-btn--block vy-btn--large" onClick={() => checkout('assessment')} disabled={pending !== null || !businessConfirmed}>
                  {pending === 'assessment' ? 'Opening secure payment…' : 'Buy the assessment for €39'}
                </button>
              )}
            </div>

            {planOffered && (
              <div className="vy-card vy-tier">
                <h3>France entry plan</h3>
                <p className="vy-price">{planPrice}</p>
                {quote?.eligible && (
                  <p className="vy-muted-strong">excl. VAT · your €39 assessment is counted ({quote.days_left} {quote.days_left === 1 ? 'day' : 'days'} left)</p>
                )}
                <p className="vy-muted-strong">Assessment included · delivered in 5 business days</p>
                <p>Positioning for French buyers, entry route, regulatory roadmap, partner and channel map, and a 12-month milestone plan. Clarifications by email, one revision round.</p>
                {paid.plan ? (
                  <p className="vy-note" role="status">The entry plan is already paid. Your brief will arrive by email.</p>
                ) : (
                  <button type="button" className="vy-btn vy-btn--block vy-btn--large" onClick={() => checkout('plan')} disabled={pending !== null || !businessConfirmed}>
                    {pending === 'plan' ? 'Opening secure payment…' : `Buy the entry plan for ${planPrice}`}
                  </button>
                )}
              </div>
            )}

            <div className="vy-card vy-tier">
              <h3>Market development</h3>
              <p className="vy-price vy-price--text">Scoped to your case</p>
              <p>Hands-on work in France, scoped from your entry plan. Available to entry plan clients.</p>
            </div>
          </div>

          {error && <p className="vy-error" role="alert">{error}</p>}
          <p className="vy-fine">Prices exclude VAT; VAT is added only where it applies. Secure payment by Stripe. For businesses only. See the <Link to="/legal/cgv">terms of sale</Link>.</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
