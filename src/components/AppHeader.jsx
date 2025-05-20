import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const AppHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center mb-10"
    >
      <div className="flex justify-center items-center mb-4">
        <ShieldCheck className="w-16 h-16 mr-3 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600" />
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
          Smart Contract Security Auditor
        </h1>
      </div>
      <p className="text-lg text-slate-300 max-w-3xl mx-auto">
        AI-powered vulnerability prediction and auditing for blockchain smart contracts.
      </p>
    </motion.div>
  );
};

export default AppHeader;