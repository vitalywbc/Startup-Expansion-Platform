import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getSource } from '../../lib/source'
import { Header, Footer } from '../Layout'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Business() {
  const [f, setF] = useState({ contact_name: '', company_name: '', contact_email: '', country: '', notes: '' })
  const [state, setState] = useState('idle')
  const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))
  const valid = f.contact_name.trim().length > 1 && f.company_name.trim().length > 1 && EMAIL_RE.test(f.contact_email.trim())

  async function send(e) {
    e.preventDefault()
    if (!valid) return
    setState('sending')
    const payload = { id: crypto.randomUUID(), ...f, source: getSource(), channel: 'direct_paid', company_type: 'established' }
    const { error } = await supabase.from('submissions').insert([payload])
    fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {})
    setState(error ? 'error' : 'sent')
  }

  return (
    <div className="vy-app">
      <Header market="France" />
      <main className="vy-wrap vy-narrow vy-section">
        <h1 className="vy-h2">Request a market-selection brief</h1>
        {state === 'sent' ? (
          <p className="vy-lead">Thank you. You'll receive a reply within 2 business days to scope the brief.</p>
        ) : (
          <form className="vy-form" onSubmit={send} noValidate>
            <p className="vy-body">For established companies comparing several European markets. Tell us where you stand and we'll reply to scope the brief.</p>
            <label>Your name<input value={f.contact_name} onChange={set('contact_name')} autoComplete="name" /></label>
            <label>Company<input value={f.company_name} onChange={set('company_name')} autoComplete="organization" /></label>
            <label>Work email<input type="email" value={f.contact_email} onChange={set('contact_email')} autoComplete="email" /></label>
            <label>Country of incorporation<input value={f.country} onChange={set('country')} /></label>
            <label>Which markets are you comparing, and why now?<textarea rows="5" value={f.notes} onChange={set('notes')} /></label>
            {state === 'error' && <p className="vy-error" role="alert">Your request wasn't saved. Try again, or write to hello@verynta.com.</p>}
            <button className="vy-btn vy-btn--large" type="submit" disabled={!valid || state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Send request'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
