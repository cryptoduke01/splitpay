import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CivicAuthProvider } from '@civic/auth-web3/react'
import { Buffer } from 'buffer'

window.Buffer = window.Buffer || Buffer

const civicClientId = import.meta.env.VITE_CIVIC_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CivicAuthProvider clientId={civicClientId}>
      <App />
    </CivicAuthProvider>
  </StrictMode>,
)
