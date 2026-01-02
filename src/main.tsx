import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { sdk } from '@farcaster/miniapp-sdk'

// Hide Farcaster loading splash as soon as possible
sdk.actions.ready()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
