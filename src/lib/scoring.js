/**
 * Preliminary score calculation — five dimensions, each 0–100.
 */

const REVENUE_SCORES = {
  'Under €100k': 10,
  '€100k–€1M': 30,
  '€1M–€5M': 55,
  '€5M–€20M': 80,
  'Over €20M': 100,
}

const INTL_REVENUE_SCORES = {
  'None — all domestic': 0,
  'Under 20%': 25,
  '20–50%': 60,
  'Over 50%': 100,
}

const EXPANSION_EXP_SCORES = {
  'No international expansion yet': 10,
  'Yes — digital/remote from home base': 40,
  'Yes — through a local agent or commercial partner': 60,
  'Yes — through a local entity or office': 80,
  'Yes — through acquisition or joint venture': 90,
}

const TIMELINE_SCORES = {
  'Within 6 months': 100,
  '6–12 months': 70,
  '1–2 years': 40,
  'Exploring — no timeline yet': 15,
}

const CONNECTION_SCORES = {
  'Yes, active relationships': 85,
  'Yes, informal contacts': 45,
  'None yet': 10,
}

const EMPLOYEE_SCORES = {
  'Under 10': 20,
  '10–30': 45,
  '31–100': 70,
  'Over 100': 90,
}

function clamp(val) {
  return Math.max(0, Math.min(100, Math.round(val)))
}

export function calculateScores(data) {
  // 1. Market validation — revenue + international revenue share
  const revScore = REVENUE_SCORES[data.revenue] ?? 0
  const intlRevScore = INTL_REVENUE_SCORES[data.intl_revenue] ?? 0
  const scoreMarket = clamp((revScore * 0.5) + (intlRevScore * 0.5))

  // 2. International maturity — expansion experience
  const scoreIntl = clamp(EXPANSION_EXP_SCORES[data.expansion_exp] ?? 0)

  // 3. France intent clarity — drivers + timeline
  const drivers = data.france_drivers || []
  const exploringPenalty = drivers.includes(
    'Exploring — France is one of several options we are evaluating'
  ) ? -15 : 0
  const driverScore = clamp(Math.min(drivers.length * 18, 85) + exploringPenalty)
  const timelineScore = TIMELINE_SCORES[data.timeline] ?? 0
  const scoreIntent = clamp((driverScore * 0.5) + (timelineScore * 0.5))

  // 4. Network and connections
  const scoreNetwork = clamp(CONNECTION_SCORES[data.france_connections] ?? 0)

  // 5. Expansion readiness — company size + support needs breadth
  const empScore = EMPLOYEE_SCORES[data.employees] ?? 0
  const supportCount = (data.support_needed || []).length
  const supportScore = clamp(supportCount * 15)
  const scoreReadiness = clamp((empScore * 0.5) + (supportScore * 0.5))

  return {
    score_market: scoreMarket,
    score_intl: scoreIntl,
    score_intent: scoreIntent,
    score_network: scoreNetwork,
    score_readiness: scoreReadiness,
  }
}

export function getScoreLabel(score) {
  if (score < 20) return 'Low'
  if (score < 40) return 'Developing'
  if (score < 60) return 'Moderate'
  if (score < 80) return 'Strong'
  return 'Advanced'
}
