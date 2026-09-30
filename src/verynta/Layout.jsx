import { Link } from './router'

export function Header({ market }) {
  return (
    <header className="vy-header">
      <Link to="/" className="vy-wordmark">
        verynta{market && <span className="vy-wordmark__market"> {market}</span>}
      </Link>
      {market && (
        <nav className="vy-nav">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <Link to="/france/intake" className="vy-btn vy-btn--small">Start free intake</Link>
        </nav>
      )}
      {!market && (
        <nav className="vy-nav">
          <a href="#markets">Markets</a>
          <a href="#steps">How it works</a>
          <Link to="/france" className="vy-btn vy-btn--small">Check your readiness</Link>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="vy-footer">
      <span className="vy-wordmark">verynta</span>
      <nav className="vy-footer__links">
        <Link to="/legal/mentions">Mentions légales</Link>
        <Link to="/legal/cgv">CGV</Link>
        <Link to="/legal/privacy">Privacy</Link>
        <a href="mailto:hello@verynta.com">hello@verynta.com</a>
      </nav>
    </footer>
  )
}
