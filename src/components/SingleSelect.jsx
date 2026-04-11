export default function SingleSelect({ options, value, onChange }) {
  return (
    <div className="options-grid">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`option-btn${value === opt ? ' option-btn--selected' : ''}`}
          onClick={() => onChange(opt)}
        >
          <span className="option-btn__indicator" />
          {opt}
        </button>
      ))}
    </div>
  )
}
