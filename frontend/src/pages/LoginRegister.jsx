import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLoader, FiCheckCircle } from 'react-icons/fi';

const LoginRegister = () => {
  const { login, register, isAuthenticated, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  // Toggle states
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTarget]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (!isLogin && !name) {
      addToast('Please provide your name', 'error');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          addToast('Welcome back to Pizza Palace!', 'success');
          navigate(redirectTarget, { replace: true });
        } else {
          addToast(res.message, 'error');
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          addToast('Account created successfully! Welcome.', 'success');
          navigate(redirectTarget, { replace: true });
        } else {
          addToast(res.message, 'error');
        }
      }
    } catch (err) {
      addToast('An unexpected authentication error occurred', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    // Reset forms
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl border border-neutralLight-dark p-8 sm:p-10 shadow-xl max-w-md w-full mx-4"
      >
        {/* Banner Logo Title */}
        <div className="text-center mb-8">
          <span className="text-3xl">🍕</span>
          <h2 className="text-2xl font-extrabold text-neutralDark mt-3">
            {isLogin ? 'Welcome Back' : 'Join the Palace'}
          </h2>
          <p className="text-neutral-500 text-xs mt-1 font-semibold uppercase tracking-wider">
            {isLogin ? 'Log in to place your pizza order' : 'Create an account to start ordering'}
          </p>
        </div>

        {/* Forms */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name Field (Register Mode Only) */}
          {!isLogin && (
            <div>
              <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-neutralLight-dark rounded-xl py-2.5 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                />
                <FiUser className="absolute left-3.5 top-3.5 text-neutral-400 text-sm" />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@gmail.com"
                className="w-full bg-white border border-neutralLight-dark rounded-xl py-2.5 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
              />
              <FiMail className="absolute left-3.5 top-3.5 text-neutral-400 text-sm" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-neutralLight-dark rounded-xl py-2.5 pl-10 pr-10 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
              />
              <FiLock className="absolute left-3.5 top-3.5 text-neutral-400 text-sm" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutralDark"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Register Mode Only) */}
          {!isLogin && (
            <div>
              <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-neutralLight-dark rounded-xl py-2.5 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                />
                <FiLock className="absolute left-3.5 top-3.5 text-neutral-400 text-sm" />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 bg-primary text-white font-extrabold py-3.5 rounded-xl hover:bg-primary-dark shadow-md hover:shadow-primary/20 transition-all mt-4 ${
              submitting ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin text-lg" />
                <span>Working...</span>
              </>
            ) : (
              <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        {/* Social auth placeholder buttons */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-neutralLight-dark"></div>
          <span className="flex-shrink mx-4 text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">Or Continue With</span>
          <div className="flex-grow border-t border-neutralLight-dark"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button" 
            onClick={() => addToast('Google authentication is disabled in local demo mode', 'info')}
            className="flex items-center justify-center gap-2 bg-white border border-neutralLight-dark rounded-xl py-2.5 text-xs font-bold text-neutralDark hover:bg-neutralLight transition-colors"
          >
            <span>Google</span>
          </button>
          <button 
            type="button" 
            onClick={() => addToast('Apple authentication is disabled in local demo mode', 'info')}
            className="flex items-center justify-center gap-2 bg-white border border-neutralLight-dark rounded-xl py-2.5 text-xs font-bold text-neutralDark hover:bg-neutralLight transition-colors"
          >
            <span>Apple</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="mt-8 text-center text-xs font-semibold text-neutral-500">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={handleToggleMode}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegister;
