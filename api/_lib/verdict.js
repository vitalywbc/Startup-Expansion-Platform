// Server-side copy of the thresholds in src/verynta/Gauge.jsx. The result page uses its
// copy to decide what to show; this one decides what may actually be sold. Keep them in step.
export const SCORE_COLUMNS = ['score_market', 'score_intl', 'score_intent', 'score_network', 'score_readiness']

export function verdictFromScores(scores) {
  const avg = SCORE_COLUMNS.reduce((s, k) => s + (scores?.[k] ?? 0), 0) / SCORE_COLUMNS.length
  if (avg < 40) return 'validation'
  if (avg < 65) return 'conditional'
  return 'ready'
}
