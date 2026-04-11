import { useState, useRef, useEffect } from 'react'

export default function SearchSelect({ options, value, onChange, placeholder, onBlur, hasError }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
        if (onBlur) onBlur()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onBlur])

  function select(opt) {
    onChange(opt)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="search-select" ref={wrapRef}>
      <button
        type="button"
        className={'text-input search-select__trigger' + (hasError ? ' text-input--error' : '')}
        onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 0) }}
      >
        <span className={value ? 'search-select__value' : 'search-select__placeholder'}>
          {value || placeholder}
        </span>
        <span className="search-select__chevron" aria-hidden="true">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {open && (
        <div className="search-select__dropdown">
          <input
            ref={inputRef}
            className="search-select__search"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <ul className="search-select__list">
            {filtered.length === 0 && (
              <li className="search-select__empty">No matches</li>
            )}
            {filtered.map(opt => (
              <li
                key={opt}
                className={'search-select__option' + (opt === value ? ' search-select__option--selected' : '')}
                onMouseDown={() => select(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
