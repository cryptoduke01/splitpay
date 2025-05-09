import { useState } from 'react'

const BillForm = ({ setSplits }) => {
  const [amount, setAmount] = useState('')
  const [names, setNames] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const people = names.split(',').map(name => name.trim()).filter(Boolean)
    if (people.length === 0 || isNaN(amount)) return

    const perPerson = (parseFloat(amount) / people.length).toFixed(2)
    const result = people.map(name => ({ name, amount: perPerson }))
    setSplits(result)

    setAmount('')
    setNames('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label className="block text-sm mb-1">Total Bill Amount (₦)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">People (comma separated)</label>
        <input
          type="text"
          value={names}
          onChange={e => setNames(e.target.value)}
          placeholder="e.g. John, Ada, Chioma"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-[#C4FF61] text-black font-bold py-2 px-4 rounded hover:opacity-90 transition"
      >
        Split Bill
      </button>
    </form>
  )
}

export default BillForm
