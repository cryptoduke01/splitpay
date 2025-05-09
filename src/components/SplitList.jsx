const SplitList = ({ splits }) => {
  if (splits.length === 0) return null

  return (
    <div className="bg-gray-900 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Split Details</h2>
      <ul className="space-y-2">
        {splits.map((item, idx) => (
          <li key={idx} className="flex justify-between border-b border-gray-700 pb-1">
            <span>{item.name}</span>
            <span>₦{item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SplitList
