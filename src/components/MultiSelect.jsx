export default function MultiSelect({ options, selected, onToggle }) {
  return (
    <div className="options-grid">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`option-btn option-btn--multi${selected.includes(opt) ? ' option-btn--selected' : ''}`}
          onClick={() => onToggle(opt)}
        >
          <span className="option-btn__indicator" />
          {opt}
        </button>
      ))}
    </div>
  )
}
