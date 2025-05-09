import { useState, forwardRef, useImperativeHandle } from "react"
import { motion } from "framer-motion"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

const PaymentRequest = forwardRef(({ recipient, name, amount, onComplete }, ref) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [status, setStatus] = useState("pending") // pending, processing, completed, failed
  const [error, setError] = useState(null)

  const isValidAddress = (address) => {
    try {
      new PublicKey(address)
      return true
    } catch {
      return false
    }
  }

  const handlePayment = async () => {
    setError(null)
    if (!publicKey) {
      setError("Please connect your wallet to pay.")
      return
    }
    if (!isValidAddress(recipient)) {
      setError("Invalid public key input")
      setStatus("failed")
      return
    }
    setStatus("processing")
    setError(null)

    // Helper to build and send the transaction
    const buildAndSend = async () => {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        }),
      )
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey
      const signature = await sendTransaction(transaction, connection)
      const confirmation = await connection.confirmTransaction(signature)
      if (confirmation.value.err) {
        throw new Error("Transaction failed")
      }
    }

    // Try once, retry on blockhash error
    try {
      await buildAndSend()
      setStatus("completed")
      onComplete?.()
    } catch (err) {
      // Retry if blockhash error
      if (err.message && err.message.toLowerCase().includes("blockhash")) {
        try {
          await buildAndSend()
          setStatus("completed")
          onComplete?.()
          return
        } catch (err2) {
          setError("Simulation failed after retry. " + (err2.message || "Unknown error"))
          setStatus("failed")
          return
        }
      }
      setError((err && err.message) || "Simulation failed. Please check your wallet and try again.")
      setStatus("failed")
    }
  }

  useImperativeHandle(ref, () => ({ handlePayment }))

  return (
    <motion.div
      className="bg-[#0a0c1b]/80 backdrop-blur-md rounded-xl p-5 border border-[#ffffff15] relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            {name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-medium text-lg text-white">{name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-indigo-200/60 break-all max-w-[180px] md:max-w-[300px] truncate">
                {recipient}
              </p>
              <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-xs font-medium text-indigo-300">
                {amount.toFixed(4)} SOL
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {status === "pending" && (
            <motion.button
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all font-medium flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
            >
              Pay Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 5L20 12L13 19M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}

          {status === "processing" && (
            <div className="flex items-center gap-2 text-indigo-300 bg-indigo-500/10 px-4 py-2.5 rounded-xl">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          )}

          {status === "completed" && (
            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2.5 rounded-xl border border-green-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 13L9 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Payment Complete</span>
            </div>
          )}

          {status === "failed" && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Payment Failed</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5"
            >
              <path
                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {error}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default PaymentRequest
