import React from 'react'
import { UserButton } from '@civic/auth-web3/react'
const TitleBar = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-[#040512] text-white">
    <h1 className="text-xl font-bold">SplitPay</h1>
    <UserButton />
  </div>
  )
} 

export default TitleBar