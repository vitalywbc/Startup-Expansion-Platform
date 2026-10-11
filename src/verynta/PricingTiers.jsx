import { Link } from './router'

// The three products, shown identically on the home page and the France page.
// The result page builds its own cards: there the buttons open checkout.
export default function PricingTiers() {
  return (
    <div className="vy-tiers">
      <div className="vy-card vy-tier vy-tier--main">
        <h3>Readiness assessment</h3>
        <p className="vy-price">€39</p>
        <p>Sector questionnaire and a written, scored readiness profile with your verdict.</p>
        <Link to="/france/intake" className="vy-btn vy-btn--block">Start the free intake</Link>
      </div>
      <div className="vy-card vy-tier">
        <h3>France entry plan</h3>
        <p className="vy-price">€790</p>
        <p>Positioning for French buyers, entry route, regulatory roadmap, partner and channel map, and a 12-month milestone plan. Clarifications by email, one revision round.</p>
        <p className="vy-muted-strong">Assessment included · delivered in 5 business days</p>
        <Link to="/france/intake" className="vy-btn vy-btn--block">Start the free intake</Link>
      </div>
      <div className="vy-card vy-tier">
        <h3>Market development</h3>
        <p className="vy-price vy-price--text">Scoped to your case</p>
        <p>Hands-on work in France, scoped from your entry plan. Available to entry plan clients.</p>
      </div>
    </div>
  )
}
