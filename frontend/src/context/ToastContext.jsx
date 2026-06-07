import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto remove toast after 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Render Area */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-emerald-500/90 text-white border-emerald-400/30' 
                  : toast.type === 'error'
                  ? 'bg-rose-600/95 text-white border-rose-400/30'
                  : 'bg-neutralDark-light/95 text-white border-neutral-700/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <FiCheckCircle className="text-xl shrink-0" />}
                {toast.type === 'error' && <FiXCircle className="text-xl shrink-0" />}
                {toast.type === 'info' && <FiInfo className="text-xl shrink-0" />}
                <p className="font-sans text-sm font-semibold">{toast.message}</p>
              </div>
              
              <button 
                onClick={() => removeToast(toast.id)} 
                className="ml-4 text-white/80 hover:text-white transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
