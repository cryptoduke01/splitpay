import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PaymentRequest from "./PaymentRequest"

const SplitList = ({ splits, onPaymentComplete }) => {
  const totalAmount = splits.reduce((sum, split) => sum + split.amount, 0)
  const paymentRefs = useRef([])

  const handlePayAll = async () => {
    for (const ref of paymentRefs.current) {
      if (ref && ref.handlePayment) {
        // eslint-disable-next-line no-await-in-loop
        await ref.handlePayment()
      }
    }
  }

  if (splits.length === 0) {
    return null
  }

  return (
    <motion.div
      className="w-full bg-[#0f1225]/80 backdrop-blur-lg rounded-2xl shadow-xl border border-[#ffffff15] p-6 md:p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Split Details
        </h2>
        <div className="flex items-center gap-3 bg-[#0a0c1b]/80 rounded-xl px-5 py-3 border border-[#ffffff10]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-[#ffffff10]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 6V18M6 12H18"
                stroke="#8B5CF6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-indigo-200/60">Total Amount</p>
            <p className="text-lg font-semibold text-white">{totalAmount.toFixed(4)} SOL</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full mb-8">
        <AnimatePresence>
          {splits.map((split, index) => (
            <motion.div
              key={`${split.address}-${index}`}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <PaymentRequest
                ref={(el) => (paymentRefs.current[index] = el)}
                recipient={split.address}
                name={split.name}
                amount={split.amount}
                onComplete={() => onPaymentComplete?.(split)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3.5 px-8 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 text-base flex items-center justify-center gap-2 mx-auto"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayAll}
      >
        Pay All Splits
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 5L20 12L13 19M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </motion.div>
  )
}

export default SplitList
