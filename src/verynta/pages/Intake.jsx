import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getSource } from '../../lib/source'
import { calculateScores } from '../../lib/scoring'
import StepOne, { hasStepOneErrors } from '../../components/StepOne'
import StepTwo from '../../components/StepTwo'
import StepThree from '../../components/StepThree'
import StepFour, { hasStepFourErrors } from '../../components/StepFour'
import ProgressBar from '../../components/ProgressBar'
import { Header } from '../Layout'
import { navigate } from '../router'

const INITIAL = {
  company_name: '', country: '', sector: '', sector_other: '', employees: '', revenue: '',
  intl_revenue: '', expansion_exp: '', france_drivers: [], gateway_countries: [], timeline: '',
  support_needed: [], main_concern: '', france_connections: '', contact_name: '', contact_email: '',
  contact_alt: '',
}

export default function Intake() {
  const [forked, setForked] = useState(false)
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL)
  const [source] = useState(() => getSource())
  const [submitting, setSubmitting] = useState(false)

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }))
  const toggleMulti = (field, value) => setData(prev => ({
    ...prev,
    [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
  }))
  const go = n => { setStep(n); window.scrollTo(0, 0) }

  async function submit() {
    setSubmitting(true)
    const scores = calculateScores(data)
    const resolved = { ...data }
    if (resolved.sector === 'Other') resolved.sector = resolved.sector_other.trim()
    delete resolved.sector_other
    const id = crypto.randomUUID()
    const payload = { id, ...resolved, source, channel: 'direct_paid', company_type: 'startup', ...scores }

    const [db] = await Promise.allSettled([
      supabase.from('submissions').insert([payload]),
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {}),
    ])
    if (db.status === 'rejected' || db.value?.error) {
      console.error('Supabase insert failed', db.reason || db.value?.error)
    }

    try {
      sessionStorage.setItem('vy_result', JSON.stringify({
        id, scores, company_name: resolved.company_name, email: resolved.contact_email,
      }))
    } catch { /* storage unavailable: result page will ask to restart */ }
    navigate('/france/result')
  }

  if (!forked) {
    return (
      <div className="vy-app">
        <Header market="France" />
        <main className="vy-wrap vy-narrow vy-section">
          <h1 className="vy-h2">Which describes you best?</h1>
          <div className="vy-fork">
            <button type="button" className="vy-fork__option" onClick={() => { setForked(true); window.scrollTo(0, 0) }}>
              <span className="vy-fork__title">A startup or scale-up planning to enter France</span>
              <span className="vy-fork__desc">Free intake now, full readiness assessment for €39 excl. VAT.</span>
            </button>
            <button type="button" className="vy-fork__option" onClick={() => navigate('/france/business')}>
              <span className="vy-fork__title">An established company choosing between European markets</span>
              <span className="vy-fork__desc">Request a market-selection brief, scoped with you.</span>
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="vy-app">
        <Header market="France" />
        <div className="submit-loading"><div className="spinner" /><p>Calculating your preliminary position…</p></div>
      </div>
    )
  }

  return (
    <div className="vy-app">
      <Header market="France" />
      <ProgressBar step={step} total={4} />
      <div className="form-container" key={step}>
        {step === 1 && <StepOne data={data} update={update} onNext={hasStepOneErrors(data) ? null : () => go(2)} />}
        {step === 2 && <StepTwo data={data} update={update} toggleMulti={toggleMulti} />}
        {step === 3 && <StepThree data={data} update={update} toggleMulti={toggleMulti} />}
        {step === 4 && <StepFour data={data} update={update} onSubmit={hasStepFourErrors(data) ? null : submit} />}
        <div className="nav">
          {step > 1 ? <button className="nav__back" onClick={() => go(step - 1)}>Back</button> : <span />}
          {step < 4 ? (
            <button className="nav__next" onClick={() => go(step + 1)} disabled={step === 1 && hasStepOneErrors(data)}>Next</button>
          ) : (
            <button className="nav__next" onClick={submit} disabled={hasStepFourErrors(data)}>See my position</button>
          )}
        </div>
      </div>
    </div>
  )
}
