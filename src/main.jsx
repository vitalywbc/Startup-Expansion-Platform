import React from 'react'
import ReactDOM from 'react-dom/client'
import LegacyApp from './LegacyApp'
import VeryntaApp from './verynta/VeryntaApp'
import { isVerynta } from './lib/site'
import './index.css'

const App = isVerynta() ? VeryntaApp : LegacyApp

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
