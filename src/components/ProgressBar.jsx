export default function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100)

  return (
    <div className="progress">
      <p className="progress__label">Step {step} of {total} &middot; {pct}%</p>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
