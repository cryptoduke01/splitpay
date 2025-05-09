import { useState } from "react"
import { motion } from "framer-motion"

const BillForm = ({ onSplits }) => {
  const [amount, setAmount] = useState("")
  const [people, setPeople] = useState([{ name: "", address: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handlePersonChange = (index, field, value) => {
    setPeople((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  const handleAddPerson = () => {
    setPeople((prev) => [...prev, { name: "", address: "" }])
  }

  const handleRemovePerson = (index) => {
    setPeople((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const validPeople = people.filter((p) => p.name && p.address)
    const amt = parseFloat(amount)
    if (validPeople.length === 0 || isNaN(amt)) {
      setIsSubmitting(false)
      setError("Please enter a valid amount and at least one person with name and address.")
      return
    }
    if (validPeople.some((p) => !p.address)) {
      setIsSubmitting(false)
      setError("Each person must include a name and a wallet address.")
      return
    }

    const perPerson = amt / validPeople.length
    const result = validPeople.map((p) => ({ name: p.name, address: p.address, amount: perPerson }))

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSplits(result)
    setAmount("")
    setPeople([{ name: "", address: "" }])
    setIsSubmitting(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row md:space-x-6 gap-6 mb-8">
        <div className="flex-1 space-y-2">
          <label className="block text-base font-medium text-indigo-200 mb-2">Total Bill Amount (SOL)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0f1225]/80 border border-[#ffffff15] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-white placeholder-gray-400 text-lg shadow-inner"
              placeholder="Enter amount in SOL"
              required
              min="0"
              step="0.0001"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <label className="block text-base font-medium text-indigo-200">Split Between</label>
          <motion.button
            type="button"
            onClick={handleAddPerson}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f1225]/80 border border-[#ffffff15] text-indigo-200 rounded-full text-sm font-medium hover:bg-[#161a36]/80 transition shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add Person
          </motion.button>
        </div>

        <div className="space-y-3">
          {people.map((person, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col md:flex-row md:space-x-3 items-center gap-3 bg-[#0f1225]/80 rounded-xl p-4 border border-[#ffffff15] relative overflow-hidden group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-white font-medium border border-[#ffffff10] shadow-lg hidden md:flex">
                {idx + 1}
              </div>
              
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handlePersonChange(idx, "name", e.target.value)}
                  placeholder="Name"
                  className="w-full p-3 rounded-xl bg-[#0a0c1b]/80 border border-[#ffffff10] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 shadow-inner mb-3 md:mb-0"
                  required
                />
              </div>
              
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={person.address}
                  onChange={(e) => handlePersonChange(idx, "address", e.target.value)}
                  placeholder="Wallet Address"
                  className="w-full p-3 rounded-xl bg-[#0a0c1b]/80 border border-[#ffffff10] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-400 shadow-inner"
                  required
                />
              </div>
              
              {people.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => handleRemovePerson(idx)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0c1b]/80 border border-[#ffffff10] text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {error && (
        <motion.div
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <div className="flex justify-end">
        <motion.button
          type="submit"
          className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Split Bill
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default BillForm
