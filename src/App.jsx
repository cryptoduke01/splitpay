import { useState } from "react"
import { motion } from "framer-motion"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import { CivicAuthProvider, useUser } from "@civic/auth-web3/react"
import { useWallet as useWalletSolana } from "@solana/wallet-adapter-react"
import TitleBar from "./components/TitleBar"
import BillForm from "./components/BillForm"
import SplitList from "./components/SplitList"
import WalletBalance from "./components/WalletBalance"

import "@solana/wallet-adapter-react-ui/styles.css"

const endpoint = clusterApiUrl("devnet")
const wallets = [] // Only use Civic embedded wallet

const civicClientId = import.meta.env.VITE_CIVIC_CLIENT_ID

const App = () => {
  const [splits, setSplits] = useState([])
  const [section, setSection] = useState("home")

  const handleSplits = (newSplits) => setSplits(newSplits)
  const handlePaymentComplete = (split) => {
    setSplits((prevSplits) => prevSplits.map((s) => (s.recipient === split.recipient ? { ...s, paid: true } : s)))
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId={civicClientId}>
            <InnerApp
              splits={splits}
              handleSplits={handleSplits}
              handlePaymentComplete={handlePaymentComplete}
              section={section}
              onSectionChange={setSection}
            />
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function InnerApp({ splits, handleSplits, handlePaymentComplete, section, onSectionChange }) {
  const { user } = useUser()
  const { connected, publicKey } = useWalletSolana()

  // Debug output
  console.log("Civic user:", user)
  console.log("Wallet connected:", connected)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0c1b] via-[#131642] to-[#1a1c3b] text-white">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent z-0"></div>

      <div className="relative z-10">
        <TitleBar section={section} onSectionChange={onSectionChange} />

        <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {section === "home" && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-12 md:py-20">
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#ffffff10] backdrop-blur-md border border-[#ffffff15] text-sm font-medium text-indigo-200">
                  [ 150+ transactions ]
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="block">Splitting Payments</span>
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Beyond Boundaries
                  </span>
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-xl">
                  Simplified Payment Fractionalization with Unrivaled Speed via SplitPay
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                  onClick={() => onSectionChange("split")}
                >
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.33337 8H12.6667M12.6667 8L8.00004 3.33333M12.6667 8L8.00004 12.6667"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              <motion.div
                className="flex-1 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="relative w-full h-[400px]">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/20 blur-[80px]"></div>
                  <motion.div
                    className="absolute top-[10%] left-[20%] w-[120px] h-[120px] bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30 backdrop-blur-md border border-indigo-400/30 flex items-center justify-center"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2L3 7L12 12L21 7L12 2Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 17L12 22L21 17"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 12L12 17L21 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute top-[30%] right-[15%] w-[140px] h-[140px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30 backdrop-blur-md border border-purple-400/30 flex items-center justify-center"
                    animate={{
                      y: [0, 20, 0],
                      rotate: [0, -8, 0],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.5 9C9.5 8.17157 10.1716 7.5 11 7.5H13C13.8284 7.5 14.5 8.17157 14.5 9C14.5 9.82843 13.8284 10.5 13 10.5H11C10.1716 10.5 9.5 11.1716 9.5 12C9.5 12.8284 10.1716 13.5 11 13.5H13C13.8284 13.5 14.5 14.1716 14.5 15C14.5 15.8284 13.8284 16.5 13 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 7.5V6M12 18V16.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-[15%] left-[30%] w-[100px] h-[100px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 backdrop-blur-md border border-blue-400/30 flex items-center justify-center"
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 12V3M12 12L17 7M12 12L7 7M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {section === "home" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <motion.div
                className="bg-[#0f1225]/50 backdrop-blur-lg rounded-2xl p-6 border border-[#ffffff15] shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Splitting</h3>
                <p className="text-gray-400 text-sm">Direct peer-to-peer transactions with real-world assets</p>
              </motion.div>

              <motion.div
                className="bg-[#0f1225]/50 backdrop-blur-lg rounded-2xl p-6 border border-[#ffffff15] shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17 8L21 12M21 12L17 16M21 12H3"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Shared Expenses</h3>
                <p className="text-gray-400 text-sm">Shared ownership through fractionalization of physical assets</p>
              </motion.div>

              <motion.div
                className="bg-[#0f1225]/50 backdrop-blur-lg rounded-2xl p-6 border border-[#ffffff15] shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Integrity</h3>
                <p className="text-gray-400 text-sm">
                  Reliable payment verification transactions backed by audit trails
                </p>
              </motion.div>
            </div>
          )}

          {section === "split" && (
            <>
              <motion.div
                className="bg-[#0f1225]/50 backdrop-blur-lg rounded-2xl shadow-xl border border-[#ffffff15] p-6 overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <WalletBalance />
                <BillForm onSplits={handleSplits} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <SplitList splits={splits} onPaymentComplete={handlePaymentComplete} />
              </motion.div>

              <motion.div
                className="text-sm text-indigo-300/60 bg-[#0f1225]/30 backdrop-blur-md rounded-xl p-4 border border-[#ffffff10]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Connected Wallet: {publicKey?.toBase58() || "Not connected"}
              </motion.div>
            </>
          )}

          {section === "history" && (
            <motion.div
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-[#0f1225]/50 backdrop-blur-lg rounded-2xl shadow-xl border border-[#ffffff15] p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-400 opacity-40"
              >
                <path
                  d="M21 14L3 14M3 14L10 7M3 14L10 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Transaction History
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                Your past splits and payments will appear here. Track all your transactions in one place.
              </p>

              <button className="mt-4 px-6 py-2.5 rounded-full bg-[#ffffff15] hover:bg-[#ffffff20] transition-colors text-sm font-medium text-white">
                Coming Soon
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
