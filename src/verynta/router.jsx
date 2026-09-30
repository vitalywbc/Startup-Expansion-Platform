import { useEffect, useState } from 'react'

export function navigate(to) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event('popstate'))
  window.scrollTo(0, 0)
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return path.replace(/\/+$/, '') || '/'
}

// Internal link: plain <a> that navigates without a full reload.
export function Link({ to, children, ...rest }) {
  function onClick(e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    if (to.startsWith('#') || to.startsWith('http') || to.startsWith('mailto:')) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={onClick} {...rest}>{children}</a>
}
