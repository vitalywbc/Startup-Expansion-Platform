import { Header, Footer } from '../Layout'

export default function Thanks() {
  return (
    <div className="vy-app">
      <Header market="France" />
      <main className="vy-wrap vy-narrow vy-section">
        <h1 className="vy-h1">Payment received</h1>
        <p className="vy-lead">Your sector questionnaire will arrive by email within 2 business days. Once you send your answers, your readiness profile follows within 5 business days.</p>
        <p className="vy-body">Your invoice and receipt come separately from Stripe. Questions: <a href="mailto:hello@verynta.com">hello@verynta.com</a>.</p>
      </main>
      <Footer />
    </div>
  )
}
