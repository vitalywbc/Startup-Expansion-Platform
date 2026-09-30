import { Header, Footer } from '../Layout'
import { Link } from '../router'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="vy-hero vy-hero--home vy-wrap">
          <h1 className="vy-display">Know whether a market will take you, and who in it will buy.</h1>
          <p className="vy-lead">Verynta assesses a company's readiness for a specific European market, then finds the buyers, partners and channels inside it. France first.</p>
        </section>

        <section id="markets" className="vy-wrap vy-section-tight">
          <div className="vy-markets">
            <Link to="/france" className="vy-market vy-market--open">
              <span className="vy-market__status">Open now</span>
              <span className="vy-market__name">France</span>
              <span className="vy-market__desc">Readiness assessment, entry plan and market development for companies entering France.</span>
            </Link>
            <div className="vy-market">
              <span className="vy-market__status">Next</span>
              <span className="vy-market__name">Germany</span>
              <span className="vy-market__desc">The same method with a German regulatory and procurement layer.</span>
            </div>
            <div className="vy-market">
              <span className="vy-market__status">Next</span>
              <span className="vy-market__name">Netherlands</span>
              <span className="vy-market__desc">Planned after Germany.</span>
            </div>
          </div>
        </section>

        <section id="steps" className="vy-band-white">
          <div className="vy-wrap vy-two">
            <div className="vy-step">
              <span className="vy-step__num">1</span>
              <h2 className="vy-h2">Will the market take you?</h2>
              <p>A written, scored verdict on your readiness for one market: the sector barriers that apply to you, your strongest signals and what to fix first. From €39 excl. VAT.</p>
              <Link to="/france" className="vy-textlink">France readiness assessment</Link>
            </div>
            <div className="vy-step">
              <span className="vy-step__num vy-step__num--muted">2</span>
              <h2 className="vy-h2">Who in it will buy?</h2>
              <p>Market discovery: identifying and qualifying the companies, partners and channels in your target market that match what you sell.</p>
              <span className="vy-muted">In development</span>
            </div>
          </div>
        </section>

        <section className="vy-wrap vy-section">
          <h2 className="vy-h3">French company going abroad?</h2>
          <p className="vy-body">The same method works outbound, from France to other European markets. <a href="mailto:hello@verynta.com?subject=Going%20abroad">Tell us where you are going</a>.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
