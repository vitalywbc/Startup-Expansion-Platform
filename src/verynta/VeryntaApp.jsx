import { useEffect } from 'react'
import { usePath } from './router'
import Home from './pages/Home'
import France from './pages/France'
import Intake from './pages/Intake'
import Result from './pages/Result'
import Thanks from './pages/Thanks'
import Business from './pages/Business'
import Legal from './pages/Legal'
import './verynta.css'

const TITLES = {
  '/': 'Verynta — market readiness and market discovery',
  '/france': 'Will France take your company? — Verynta',
}

export default function VeryntaApp() {
  const path = usePath()

  useEffect(() => {
    document.title = TITLES[path] || 'Verynta'
    document.body.classList.add('vy')
  }, [path])

  let page
  if (path === '/') page = <Home />
  else if (path === '/france') page = <France />
  else if (path === '/france/intake') page = <Intake />
  else if (path === '/france/result') page = <Result />
  else if (path === '/france/business') page = <Business />
  else if (path === '/thanks') page = <Thanks />
  else if (path.startsWith('/legal/')) page = <Legal page={path.split('/')[2]} />
  else page = <Home />

  return <div className="vy-root">{page}</div>
}
