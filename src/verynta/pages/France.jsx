import { Header, Footer } from '../Layout'
import { Link } from '../router'
import Gauge from '../Gauge'

export default function France() {
  return (
    <>
      <Header market="France" />
      <main>
        <section className="vy-hero vy-wrap vy-hero--split">
          <div className="vy-hero__text">
            <h1 className="vy-display">Will France take your company?</h1>
            <p className="vy-lead">A written verdict on whether the French market can absorb what you sell: the regulation, procurement and certification barriers specific to your sector, where your signals are strong, and what is missing before you commit.</p>
            <div className="vy-cta-row">
              <Link to="/france/intake" className="vy-btn">Start the free intake</Link>
              <span className="vy-muted-strong">5 minutes. Full assessment €39 excl. VAT.</span>
            </div>
          </div>
          <figure className="vy-card vy-example">
            <figcaption className="vy-example__caption">Example verdict, AgriTech company from India</figcaption>
            <div>
              <p className="vy-example__verdict">Conditionally France-ready</p>
              <p className="vy-example__sub">Strong entry signals. Commercial validation still missing.</p>
            </div>
            <Gauge verdict="conditional" />
            <ul className="vy-signals">
              <li><span className="vy-dot vy-dot--ready" />Export track record in two markets, a local reseller already interested</li>
              <li><span className="vy-dot vy-dot--conditional" />EU deforestation rules decide what French buyers can accept</li>
              <li><span className="vy-dot vy-dot--validation" />No paying French customer yet</li>
            </ul>
          </figure>
        </section>

        <section id="how" className="vy-band-white">
          <div className="vy-wrap vy-section">
            <h2 className="vy-h2 vy-h2--wide">From intake to verdict in three steps</h2>
            <ol className="vy-steps">
              <li><span className="vy-step__num">1</span><h3>Free intake</h3><p>Twelve questions about your company, revenue and plans for France. You see your preliminary position straight away.</p></li>
              <li><span className="vy-step__num">2</span><h3>Your sector questionnaire</h3><p>After payment you receive 14 questions written for your sector and product. Nothing you told us at intake is asked again.</p></li>
              <li><span className="vy-step__num">3</span><h3>Written readiness profile</h3><p>A scored profile with your verdict, the barriers that apply to you and what to fix first. Reviewed personally, within 5 business days of receiving your answers.</p></li>
            </ol>
          </div>
        </section>

        <section id="pricing" className="vy-wrap vy-section">
          <h2 className="vy-h2 vy-h2--wide">Start with the verdict. Go further if it says yes.</h2>
          <p className="vy-body">What you pay for each step is credited against the next one. Prices exclude VAT; VAT is added only where it applies.</p>
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
              <span className="vy-muted">Offered after your assessment</span>
            </div>
            <div className="vy-card vy-tier">
              <h3>Market development</h3>
              <p className="vy-price vy-price--text">Scoped to your case</p>
              <p>Hands-on work in France: partner identification, first B2B sales, pilot customers.</p>
              <span className="vy-muted">By proposal</span>
            </div>
          </div>
          <p className="vy-body">Running an established company choosing between several European markets? <Link to="/france/business">Request a market-selection brief</Link>.</p>
        </section>

        <section className="vy-band-ink">
          <div className="vy-wrap vy-two vy-section">
            <h2 className="vy-h2">Every profile is read and signed off by a person before you see it.</h2>
            <div className="vy-ink-body">
              <p>Assessments are reviewed by Vitaly Charushin, who has spent 20 years in international business development, government relations and public tenders, and works with founders entering France from India, Italy and Korea.</p>
              <p>Paris-based. Independent of any accelerator or investor.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
