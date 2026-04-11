import { useState, useRef } from 'react'

function validateName(value) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length < 2) return 'Must be at least 2 characters'
  if (!/^[a-zA-ZÀ-ÿ]/.test(trimmed)) return 'Must start with a letter'
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmed)) return 'Must contain at least one letter'
  return null
}

function validateEmail(value) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return 'Enter a valid email address'
  return null
}

export function hasStepFourErrors(data) {
  const name = data.contact_name.trim()
  const email = data.contact_email.trim()
  if (!name || !email) return true
  if (name.length < 2 || !/^[a-zA-ZÀ-ÿ]/.test(name)) return true
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return true
  return false
}

export default function StepFour({ data, update, onSubmit }) {
  const [touched, setTouched] = useState({})
  const emailRef = useRef(null)
  const altRef = useRef(null)

  const nameError = touched.contact_name ? validateName(data.contact_name) : null
  const emailError = touched.contact_email ? validateEmail(data.contact_email) : null

  return (
    <>
      <h2 className="step-title">Contact details</h2>

      <div className="form-card">
        <p className="form-card__label">Your name</p>
        <input
          className={'text-input' + (nameError ? ' text-input--error' : '')}
          placeholder="Full name"
          value={data.contact_name}
          onChange={e => update('contact_name', e.target.value)}
          onBlur={() => setTouched(prev => ({ ...prev, contact_name: true }))}
          onKeyDown={e => { if (e.key === 'Enter') emailRef.current?.focus() }}
        />
        {nameError && <span className="field-error">{nameError}</span>}
      </div>

      <div className="form-card">
        <p className="form-card__label">Email address</p>
        <input
          ref={emailRef}
          className={'text-input' + (emailError ? ' text-input--error' : '')}
          type="email"
          placeholder="you@company.com"
          required
          value={data.contact_email}
          onChange={e => update('contact_email', e.target.value)}
          onBlur={() => setTouched(prev => ({ ...prev, contact_email: true }))}
          onKeyDown={e => { if (e.key === 'Enter') altRef.current?.focus() }}
        />
        {emailError && <span className="field-error">{emailError}</span>}
      </div>

      <div className="form-card">
        <p className="form-card__label">WhatsApp or LinkedIn <span style={{ opacity: 0.5, fontWeight: 400 }}>— for faster follow-up</span></p>
        <input
          ref={altRef}
          className="text-input"
          placeholder="WhatsApp number or LinkedIn URL"
          value={data.contact_alt}
          onChange={e => update('contact_alt', e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && onSubmit) onSubmit() }}
        />
      </div>
    </>
  )
}
