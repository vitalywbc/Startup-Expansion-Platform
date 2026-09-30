import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { getSource } from './lib/source'
import { calculateScores } from './lib/scoring'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import StepOne, { hasStepOneErrors } from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import StepFour, { hasStepFourErrors } from './components/StepFour'
import ResultScreen from './components/ResultScreen'

const INITIAL_DATA = {
  company_name: '',
  country: '',
  sector: '',
  sector_other: '',
  employees: '',
  revenue: '',
  intl_revenue: '',
  expansion_exp: '',
  france_drivers: [],
  gateway_countries: [],
  timeline: '',
  support_needed: [],
  main_concern: '',
  france_connections: '',
  contact_name: '',
  contact_email: '',
  contact_alt: '',
}

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_DATA)
  const [source] = useState(() => getSource())
  const [scores, setScores] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  function toggleMulti(field, value) {
    setData(prev => {
      const arr = prev[field]
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      }
    })
  }

  function next() {
    if (step < 4) {
      setStep(s => s + 1)
      window.scrollTo(0, 0)
    }
  }

  function back() {
    if (step > 1) {
      setStep(s => s - 1)
      window.scrollTo(0, 0)
    }
  }

  async function submit() {
    setSubmitting(true)

    const computed = calculateScores(data)
    setScores(computed)

    const resolved = { ...data }
    if (resolved.sector === 'Other') resolved.sector = resolved.sector_other.trim()
    delete resolved.sector_other
    const payload = { ...resolved, source, channel: 'creative_valley', ...computed }

    // Fire Supabase insert and email notification in parallel
    const [dbResult] = await Promise.allSettled([
      supabase.from('submissions').insert([payload]),
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {}), // email is non-blocking
    ])

    if (dbResult.status === 'rejected') {
      console.error('Supabase insert failed:', dbResult.reason)
    }

    setSubmitting(false)
    setSubmitted(true)
    window.scrollTo(0, 0)
  }

  if (submitted && scores) {
    return (
      <>
        <Header />
        <ResultScreen scores={scores} contactEmail={data.contact_email} />
      </>
    )
  }

  if (submitting) {
    return (
      <>
        <Header />
        <div className="submit-loading fade-in">
          <div className="spinner" />
          <p>Submitting your profile...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <ProgressBar step={step} total={4} />
      <div className="form-container fade-in" key={step}>
        {step === 1 && <StepOne data={data} update={update} onNext={hasStepOneErrors(data) ? null : next} />}
        {step === 2 && <StepTwo data={data} update={update} toggleMulti={toggleMulti} />}
        {step === 3 && <StepThree data={data} update={update} toggleMulti={toggleMulti} />}
        {step === 4 && <StepFour data={data} update={update} onSubmit={hasStepFourErrors(data) ? null : submit} />}

        <div className="nav">
          {step > 1 ? (
            <button className="nav__back" onClick={back}>
              <span>&#8592;</span> Back
            </button>
          ) : <span />}

          {step < 4 ? (
            <button
              className="nav__next"
              onClick={next}
              disabled={step === 1 && hasStepOneErrors(data)}
            >
              Next <span>&#8594;</span>
            </button>
          ) : (
            <button
              className="nav__next nav__next--submit"
              onClick={submit}
              disabled={hasStepFourErrors(data)}
            >
              Submit <span>&#8594;</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
