import { useState, useEffect } from 'react'
import { getScoreLabel } from '../lib/scoring'

const DIMENSIONS = [
  { key: 'score_market', name: 'Market validation' },
  { key: 'score_intl', name: 'International maturity' },
  { key: 'score_intent', name: 'France intent clarity' },
  { key: 'score_network', name: 'Network & connections' },
  { key: 'score_readiness', name: 'Expansion readiness' },
]

export default function ResultScreen({ scores, contactEmail }) {
  const [animated, setAnimated] = useState(false)
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="result fade-in">
      <div className="result__badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="result__headline">Your preliminary profile is ready</h2>
      <p className="result__subtext">
        Complete the full assessment to unlock your detailed score and gap map
      </p>

      <div className="scores">
        {DIMENSIONS.map(({ key, name }) => {
          const val = scores[key] ?? 0
          return (
            <div className="score-row" key={key}>
              <div className="score-row__header">
                <span className="score-row__name">{name}</span>
                <span className="score-row__label">{getScoreLabel(val)}</span>
              </div>
              <div className="score-row__track">
                <div
                  className="score-row__fill"
                  style={{ width: animated ? `${val}%` : '0%' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* TODO: replace with link to full assessment once built */}
      <button className="result__cta" onClick={() => setShowNotice(true)}>
        Get my full readiness score <span>&#8594;</span>
      </button>
      {showNotice && (
        <p className="result__notice">
          The full assessment is coming soon — we'll notify you at {contactEmail} when it's ready.
        </p>
      )}
      <p className="result__note">Takes 10–12 minutes &middot; Personalised gap map included</p>
    </div>
  )
}
