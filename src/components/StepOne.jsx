import { useState } from 'react'
import SingleSelect from './SingleSelect'
import SearchSelect from './SearchSelect'

const EMPLOYEES = ['Under 10', '10–30', '31–100', 'Over 100']
const REVENUE = ['Under €100k', '€100k–€1M', '€1M–€5M', '€5M–€20M', 'Over €20M']
const INTL_REVENUE = ['None — all domestic', 'Under 20%', '20–50%', 'Over 50%']

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia',
  'Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium',
  'Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad',
  'Chile','China','Colombia','Comoros','Congo (Democratic Republic)','Congo (Republic)','Costa Rica',
  "Cote d'Ivoire",'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia',
  'Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece',
  'Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India',
  'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya',
  'Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
  'Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta',
  'Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia',
  'Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand',
  'Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau',
  'Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
  'Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
  'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
  'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen',
  'Zambia','Zimbabwe',
]

const SECTORS = [
  'Aerospace & Defence','Agriculture & FoodTech','Automotive & Mobility','Biotechnology',
  'CleanTech & Energy','Construction & PropTech','Cybersecurity','DeepTech & AI',
  'Education & EdTech','Fashion & Luxury','FinTech & Banking','Gaming & Esports',
  'Healthcare & MedTech','HR & Future of Work','Legal & RegTech','Logistics & Supply Chain',
  'Manufacturing & Industry 4.0','Media & Entertainment','Retail & E-commerce',
  'SaaS & Enterprise Software','Space & Satellites','Telecommunications','Travel & Hospitality','Other',
]

function validateCompanyName(value) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length < 2) return 'Must be at least 2 characters'
  if (!/^[a-zA-ZÀ-ÿ]/.test(trimmed)) return 'Must start with a letter'
  return null
}

function validateDropdown(value) {
  if (!value) return null
  return null
}

export function hasStepOneErrors(data) {
  const name = data.company_name.trim()
  if (!name || name.length < 2 || !/^[a-zA-ZÀ-ÿ]/.test(name)) return true
  if (!data.country) return true
  if (!data.sector) return true
  if (data.sector === 'Other') {
    const other = data.sector_other.trim()
    if (!other || other.length < 2 || !/^[a-zA-ZÀ-ÿ]/.test(other)) return true
  }
  return false
}

export default function StepOne({ data, update, onNext }) {
  const [touched, setTouched] = useState({})

  const nameError = touched.company_name ? validateCompanyName(data.company_name) : null
  const countryError = touched.country && !data.country ? 'Please select a country' : null
  const sectorError = touched.sector && !data.sector ? 'Please select a sector' : null
  const sectorOtherError = data.sector === 'Other' && touched.sector_other ? validateCompanyName(data.sector_other) : null

  return (
    <>
      <h2 className="step-title">About your company</h2>

      <div className="form-card">
        <p className="form-card__label">Company name, country of incorporation, and primary sector</p>
        <div className="text-inputs-row text-inputs-row--3">
          <div className="field-wrap">
            <input
              className={'text-input' + (nameError ? ' text-input--error' : '')}
              placeholder="Company name"
              value={data.company_name}
              onChange={e => update('company_name', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, company_name: true }))}
              onKeyDown={e => { if (e.key === 'Enter' && onNext) onNext() }}
            />
            {nameError && <span className="field-error">{nameError}</span>}
          </div>

          <div className="field-wrap">
            <SearchSelect
              options={COUNTRIES}
              value={data.country}
              onChange={v => update('country', v)}
              placeholder="Country"
              hasError={!!countryError}
              onBlur={() => setTouched(prev => ({ ...prev, country: true }))}
            />
            {countryError && <span className="field-error">{countryError}</span>}
          </div>

          <div className="field-wrap">
            <SearchSelect
              options={SECTORS}
              value={data.sector}
              onChange={v => update('sector', v)}
              placeholder="Primary sector"
              hasError={!!sectorError}
              onBlur={() => setTouched(prev => ({ ...prev, sector: true }))}
            />
            {sectorError && <span className="field-error">{sectorError}</span>}
          </div>
        </div>
        {data.sector === 'Other' && (
          <div className="field-wrap" style={{ marginTop: '0.75rem' }}>
            <input
              className={'text-input' + (sectorOtherError ? ' text-input--error' : '')}
              placeholder="Please specify your sector"
              value={data.sector_other}
              onChange={e => update('sector_other', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, sector_other: true }))}
              onKeyDown={e => { if (e.key === 'Enter' && onNext) onNext() }}
            />
            {sectorOtherError && <span className="field-error">{sectorOtherError}</span>}
          </div>
        )}
      </div>

      <div className="form-card">
        <p className="form-card__label">How many full-time employees does your company currently have?</p>
        <SingleSelect
          options={EMPLOYEES}
          value={data.employees}
          onChange={v => update('employees', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">What is your current annual revenue?</p>
        <SingleSelect
          options={REVENUE}
          value={data.revenue}
          onChange={v => update('revenue', v)}
        />
      </div>

      <div className="form-card">
        <p className="form-card__label">What proportion of your revenue currently comes from outside your home country?</p>
        <SingleSelect
          options={INTL_REVENUE}
          value={data.intl_revenue}
          onChange={v => update('intl_revenue', v)}
        />
      </div>
    </>
  )
}
