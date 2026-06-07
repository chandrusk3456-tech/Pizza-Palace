import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false }) => {
  const containerStyle = fullPage 
    ? "fixed inset-0 z-50 bg-neutralLight/80 flex flex-col items-center justify-center backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-12 w-full";

  return (
    <div className={containerStyle}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinner ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary border-r-secondary rounded-full"
        />
        {/* Central mini logo */}
        <span className="absolute text-xl">🍕</span>
      </div>
      <p className="mt-4 text-sm font-bold text-neutralDark-light tracking-wide animate-pulse">
        PREPARING FRESHNESS...
      </p>
    </div>
  );
};

export default Loader;
