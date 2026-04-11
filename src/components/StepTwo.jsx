import SingleSelect from './SingleSelect'
import MultiSelect from './MultiSelect'

const EXPANSION_EXP = [
  'No international expansion yet',
  'Yes — digital/remote from home base',
  'Yes — through a local agent or commercial partner',
  'Yes — through a local entity or office',
  'Yes — through acquisition or joint venture',
]

const FRANCE_DRIVERS = [
  'Specific client or partner opportunity in France',
  'France as the primary gateway to the EU market',
  'French ecosystem, talent, or infrastructure access',
  'French or EU funding programmes',
  'Identified French market demand for our product',
  'Exploring — France is one of several options we are evaluating',
]

const GATEWAY_COUNTRIES = [
  'France is our clear priority',
  'United Kingdom',
  'Netherlands',
  'Germany',
  'Spain',
  'Other',
]

const TIMELINE = [
  'Within 6 months',
  '6–12 months',
  '1–2 years',
  'Exploring — no timeline yet',
]

export default function StepTwo({ data, update, toggleMulti }) {
  return (
    <>
      <h2 className="step-title">Your international expansion</h2>

      <div className="form-card">
        <p className="form-card__label">Have you previously expanded into a new country market? If yes, how?</p>
        <SingleSelect
          options={EXPANSION_EXP}
          value={data.expansion_exp}
          onChange={v => update('expansion_exp', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">What is driving your interest in France specifically?</p>
        <MultiSelect
          options={FRANCE_DRIVERS}
          selected={data.france_drivers}
          onToggle={v => toggleMulti('france_drivers', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">Are you also considering alternative European entry points alongside France?</p>
        <MultiSelect
          options={GATEWAY_COUNTRIES}
          selected={data.gateway_countries}
          onToggle={v => toggleMulti('gateway_countries', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">What is your target timeline for your first commercial milestone in France?</p>
        <SingleSelect
          options={TIMELINE}
          value={data.timeline}
          onChange={v => update('timeline', v)}
        />
      </div>
    </>
  )
}
