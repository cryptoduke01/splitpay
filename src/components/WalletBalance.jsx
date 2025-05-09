import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const WalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (publicKey) {
      setLoading(true);
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (err) {
        setBalance(null);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return (
    <motion.div
      className="bg-[#181a23]/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          <span className="font-semibold text-lg">Wallet Balance</span>
        </div>
        <div className="text-3xl font-extrabold mb-1 flex items-center gap-2">
          {loading ? <span className="animate-pulse">Loading...</span> : `${balance?.toFixed(4) ?? '0.0000'} SOL`}
          <button
            onClick={fetchBalance}
            className="ml-2 p-2 rounded-xl bg-[#23243a]/70 border border-white/10 hover:bg-[#23243a]/90 transition shadow"
            title="Refresh Balance"
            disabled={loading}
          >
            <svg
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582M20 20v-5h-.581M5.21 17.293A9 9 0 0021 12M3 12a9 9 0 0114.789-5.293" />
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-300 mt-1 break-all">
          {publicKey ? publicKey.toBase58() : 'No wallet connected'}
        </div>
      </div>
      <a
        href="https://solfaucet.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:opacity-90 transition text-sm"
      >
        Get SOL
      </a>
    </motion.div>
  );
};

export default WalletBalance; 