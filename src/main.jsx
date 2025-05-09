import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CivicAuthProvider } from '@civic/auth-web3/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CivicAuthProvider clientId='1678ed36-692e-4e92-84a6-4d5ee827fed4'>
      <App />
    </CivicAuthProvider>
  </StrictMode>,
)
