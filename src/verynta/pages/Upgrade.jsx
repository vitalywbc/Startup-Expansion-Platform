import { useEffect, useState } from 'react'
import { Header, Footer } from '../Layout'
import { Link } from '../router'
import { euros } from '../money'

export default function Upgrade() {
  const params = new URLSearchParams(window.location.search)
  const sid = params.get('sid') || ''
  const cancelled = params.get('cancelled')

  const [state, setState] = useState('loading')
  const [quote, setQuote] = useState(null)
  const [businessConfirmed, setBusinessConfirmed] = useState(false)
  const [pending, setPending] = useState(false)
  const [planPaid, setPlanPaid] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let live = true
    fetch(`/api/upgrade-quote?sid=${encodeURIComponent(sid)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => { if (live) { setQuote(data); setState('ready') } })
      .catch(() => { if (live) setState('unavailable') })
    return () => { live = false }
  }, [sid])

  async function checkout() {
    if (!businessConfirmed || pending) return
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: sid, business_purchase: businessConfirmed, product: 'plan' }),
      })
      if (res.status === 409) {
        setPlanPaid(true)
        setPending(false)
        return
      }
      const body = await res.json()
      if (!res.ok || !body.url) throw new Error(body.error || 'Checkout unavailable')
      window.location.href = body.url
    } catch (e) {
      setError('The payment page could not be opened. Try again in a minute, or write to hello@verynta.com.')
      setPending(false)
    }
  }

  const frame = (children) => (
    <div className="vy-app">
      <Header market="France" />
      <main className="vy-wrap vy-narrow vy-section">{children}</main>
      <Footer />
    </div>
  )

  if (state === 'loading') return frame(<p className="vy-body">Checking your assessment…</p>)

  if (state === 'unavailable') {
    return frame(
      <>
        <h1 className="vy-h2">This upgrade link is not valid</h1>
        <p className="vy-body">The link in your confirmation email may have been truncated. Write to <a href="mailto:hello@verynta.com">hello@verynta.com</a> and we will send the plan order link.</p>
        <Link to="/france" className="vy-btn">Back to France</Link>
      </>
    )
  }

  if (!quote.plan_available) {
    return frame(
      <>
        <h1 className="vy-h2">The entry plan is not open for this assessment</h1>
        <p className="vy-body">Either the plan is already paid, or your preliminary position puts validation before a France entry plan. Write to <a href="mailto:hello@verynta.com">hello@verynta.com</a> if you think this is wrong.</p>
        <Link to="/france" className="vy-btn">Back to France</Link>
      </>
    )
  }

  return frame(
    <>
      <h1 className="vy-h2">{quote.company ? `${quote.company}, add the full France entry plan` : 'Add the full France entry plan'}</h1>
      <p className="vy-body">The plan takes your readiness profile further: positioning for French buyers, entry route, regulatory roadmap, partner and channel map, and a 12-month milestone plan.</p>

      {cancelled && <p className="vy-note">Payment was not completed. You can try again below.</p>}

      <div className="vy-card vy-tier vy-tier--main">
        <h2 className="vy-h4">France entry plan</h2>
        <p className="vy-price">{euros(quote.amount_cents)}</p>
        {quote.eligible ? (
          <p className="vy-muted-strong">excl. VAT · your €39 assessment is counted ({quote.days_left} {quote.days_left === 1 ? 'day' : 'days'} left)</p>
        ) : (
          <p className="vy-muted-strong">excl. VAT · assessment included</p>
        )}
        <p>Delivered within 5 business days of receiving your completed brief. Clarifications by email, one revision round.</p>
        {planPaid ? (
          <p className="vy-note" role="status">The entry plan is already paid. Your brief will arrive by email.</p>
        ) : (
          <>
            <label className="vy-check">
              <input type="checkbox" checked={businessConfirmed} onChange={(e) => setBusinessConfirmed(e.target.checked)} />
              <span>I am purchasing on behalf of a company or as a self-employed professional, for business purposes.</span>
            </label>
            <button type="button" className="vy-btn vy-btn--block vy-btn--large" onClick={checkout} disabled={pending || !businessConfirmed}>
              {pending ? 'Opening secure payment…' : `Buy the entry plan for ${euros(quote.amount_cents)}`}
            </button>
            {error && <p className="vy-error" role="alert">{error}</p>}
          </>
        )}
      </div>

      <p className="vy-fine">Prices exclude VAT; VAT is added only where it applies. Secure payment by Stripe. For businesses only. See the <Link to="/legal/cgv">terms of sale</Link>.</p>
    </>
  )
}
