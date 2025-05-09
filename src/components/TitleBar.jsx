import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@civic/auth-web3/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const NAV_LINKS = [
  { key: 'home', label: 'Home' },
  { key: 'split', label: 'Split Bill' },
  { key: 'history', label: 'History' },
];

const TitleBar = ({ section, onSectionChange }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#0a0c1b]/80 border-b border-[#ffffff10]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" 
              stroke="url(#paint0_linear)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M10 16H22M16 10V22" stroke="url(#paint1_linear)" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="paint0_linear" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="10" y1="16" x2="22" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            SplitPay
          </h1>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center">
          <div className="bg-[#0f1225]/50 backdrop-blur-lg rounded-full px-1.5 py-1.5 flex items-center border border-[#ffffff15]">
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                onClick={() => onSectionChange?.(link.key)}
                className={`text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 ${
                  section === link.key 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <WalletMultiButton className="!bg-[#0f1225] !border !border-[#ffffff15] !rounded-full !shadow-lg !shadow-indigo-500/10 !transition-all !hover:bg-[#161a36]" />
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <UserButton />
          </motion.div>
          
          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#0f1225]/80 border border-[#ffffff15]"
            onClick={() => setMobileNavOpen(v => !v)}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            className="md:hidden bg-[#0a0c1b]/95 backdrop-blur-xl border-b border-[#ffffff10] px-6 py-5 flex flex-col space-y-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                onClick={() => { onSectionChange?.(link.key); setMobileNavOpen(false); }}
                className={`text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 ${
                  section === link.key 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white bg-[#0f1225]/50 border border-[#ffffff10]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="mt-3 flex items-center space-x-3 pt-3 border-t border-[#ffffff10]">
              <WalletMultiButton className="flex-1 !bg-[#0f1225] !border !border-[#ffffff15]" />
              <UserButton />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default TitleBar;
