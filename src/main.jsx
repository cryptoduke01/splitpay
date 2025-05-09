import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CivicAuthProvider } from '@civic/auth-web3/react'
import { Buffer } from 'buffer'

const civicClientId = import.meta.env.VITE_CIVIC_CLIENT_ID;

if (!window.Buffer) window.Buffer = Buffer;
if (!globalThis.Buffer) globalThis.Buffer = Buffer;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CivicAuthProvider clientId={civicClientId}>
      <App />
    </CivicAuthProvider>
  </StrictMode>,
)
