import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiTrendingUp, FiShoppingBag, FiDatabase } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Monitor scroll height to make navbar solid/transparent
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      scrolled 
        ? 'glass shadow-md py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-1">
              🍕 <span className="text-neutralDark group-hover:text-primary transition-colors duration-300">Pizza</span>
              <span className="text-secondary">Palace</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8 font-semibold">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary border-b-2 border-primary pb-1 transition-all' 
                  : 'text-neutralDark hover:text-primary pb-1 transition-all'
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/menu" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary border-b-2 border-primary pb-1 transition-all' 
                  : 'text-neutralDark hover:text-primary pb-1 transition-all'
              }
            >
              Menu
            </NavLink>
            <NavLink 
              to="/order-history" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-primary border-b-2 border-primary pb-1 transition-all' 
                  : 'text-neutralDark hover:text-primary pb-1 transition-all'
              }
            >
              Track Orders
            </NavLink>
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-5">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-neutralLight-dark/50 transition-colors group">
              <FiShoppingCart className="text-2xl text-neutralDark group-hover:text-primary transition-colors" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-secondary text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth Button/Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-neutralDark text-white px-4 py-2 rounded-full hover:bg-primary transition-colors font-medium"
                >
                  <FiUser />
                  <span>{user.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutralLight-dark py-2 z-20 overflow-hidden font-medium"
                      >
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutralDark hover:bg-neutralLight hover:text-primary transition-all"
                          >
                            <FiDatabase className="text-secondary" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link 
                          to="/order-history" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutralDark hover:bg-neutralLight hover:text-primary transition-all"
                        >
                          <FiShoppingBag className="text-primary" />
                          My Orders
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-all text-left"
                        >
                          <FiLogOut />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-neutralLight-dark/50 transition-colors">
              <FiShoppingCart className="text-2xl text-neutralDark" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutralDark hover:text-primary focus:outline-none"
            >
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-30"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-40 shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-primary">Pizza Palace</span>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutralLight rounded-full">
                    <FiX className="text-2xl" />
                  </button>
                </div>

                <div className="flex flex-col gap-5 text-lg font-bold">
                  <NavLink 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => isActive ? 'text-primary' : 'text-neutralDark hover:text-primary'}
                  >
                    Home
                  </NavLink>
                  <NavLink 
                    to="/menu" 
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => isActive ? 'text-primary' : 'text-neutralDark hover:text-primary'}
                  >
                    Menu
                  </NavLink>
                  <NavLink 
                    to="/order-history" 
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => isActive ? 'text-primary' : 'text-neutralDark hover:text-primary'}
                  >
                    Track Orders
                  </NavLink>
                  {isAuthenticated && isAdmin && (
                    <NavLink 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="text-secondary hover:text-primary"
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                </div>
              </div>

              <div className="mt-auto border-t pt-6">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FiUser />
                      </div>
                      <div>
                        <p className="font-semibold text-neutralDark">{user.name}</p>
                        <p className="text-xs text-neutralDark-light">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl hover:bg-rose-100 transition-all font-semibold"
                    >
                      <FiLogOut />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full block text-center bg-primary text-white py-3 rounded-xl hover:bg-primary-dark font-semibold shadow-md transition-all"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
