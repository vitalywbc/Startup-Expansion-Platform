// The three-band verdict scale used on the France page and the result screen.
const POSITIONS = { validation: 16, conditional: 52, ready: 84 }
export const HEADLINES = {
  validation: 'Validate at home before France',
  conditional: 'Conditionally France-ready',
  ready: 'France-ready on first reading',
}

export function verdictFromScores(scores) {
  const keys = ['score_market', 'score_intl', 'score_intent', 'score_network', 'score_readiness']
  const avg = keys.reduce((s, k) => s + (scores?.[k] ?? 0), 0) / keys.length
  if (avg < 40) return 'validation'
  if (avg < 65) return 'conditional'
  return 'ready'
}

export default function Gauge({ verdict = 'conditional', compact = false }) {
  const left = POSITIONS[verdict] ?? POSITIONS.conditional
  return (
    <div className={'vy-gauge' + (compact ? ' vy-gauge--compact' : '')}>
      <div className="vy-gauge__track" role="img" aria-label={`Position: ${HEADLINES[verdict]}`}>
        <div className="vy-gauge__bands">
          <span className="vy-band vy-band--validation" />
          <span className="vy-band vy-band--conditional" />
          <span className="vy-band vy-band--ready" />
        </div>
        <span className="vy-gauge__marker" style={{ left: `${left}%` }} />
      </div>
      <div className="vy-gauge__labels" aria-hidden="true">
        <span>Validation first</span>
        <span>Conditionally ready</span>
        <span>Ready</span>
      </div>
    </div>
  )
}
