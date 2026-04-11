import SingleSelect from './SingleSelect'
import MultiSelect from './MultiSelect'

const SUPPORT_NEEDED = [
  'Introductions to potential French clients or partners',
  'Connections with entrepreneurs from my country active in France',
  'Assessment of my France market readiness',
  'Support to close my first French client',
  'Building a permanent presence in France',
  'Access to French or EU investors',
  'Understanding the regulatory and legal landscape',
]

const MAIN_CONCERN = [
  'Language and cultural barriers',
  'Finding the right local partner or distributor',
  'Legal and regulatory complexity',
  'Cost and timeline of market entry',
  'Not knowing where to start',
]

const CONNECTIONS = [
  'Yes, active relationships',
  'Yes, informal contacts',
  'None yet',
]

export default function StepThree({ data, update, toggleMulti }) {
  return (
    <>
      <h2 className="step-title">What you are looking for</h2>

      <div className="form-card">
        <p className="form-card__label">What kind of support are you looking for in France?</p>
        <MultiSelect
          options={SUPPORT_NEEDED}
          selected={data.support_needed}
          onToggle={v => toggleMulti('support_needed', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">What is your biggest concern about expanding into France?</p>
        <SingleSelect
          options={MAIN_CONCERN}
          value={data.main_concern}
          onChange={v => update('main_concern', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">Do you have any existing connections in France — clients, partners, advisors, or investors?</p>
        <SingleSelect
          options={CONNECTIONS}
          value={data.france_connections}
          onChange={v => update('france_connections', v)}
        />
      </div>
    </>
  )
}
