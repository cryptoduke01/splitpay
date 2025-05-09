import React, { useState } from 'react';
import TitleBar from './components/TitleBar';
import BillForm from './components/BillForm';
import SplitList from './components/SplitList';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { CivicAuthProvider, UserButton } from '@civic/auth-web3/react';

const App = () => {
  const [splits, setSplits] = useState([]);
  const { connected, publicKey } = useWallet();

  const ready = connected;

  return (
    <CivicAuthProvider clientId="1678ed36-692e-4e92-84a6-4d5ee827fed4">
      <div className="min-h-screen bg-[#0a0c1b] text-white">
        <TitleBar />
        <main className="p-6 max-w-3xl mx-auto space-y-6">
          <BillForm setSplits={setSplits} />
          <SplitList splits={splits} />

          <div className="space-y-2">
            <UserButton />  {/* Replaced CivicLoginButton with UserButton */}
            <WalletMultiButton />
            {connected && <p className="text-green-400">Wallet: {publicKey.toBase58()}</p>}
          </div>

          {ready && (
            <button className="mt-4 bg-green-600 px-4 py-2 rounded">Next</button>
          )}
        </main>
      </div>
    </CivicAuthProvider>
  );
};

export default App;
