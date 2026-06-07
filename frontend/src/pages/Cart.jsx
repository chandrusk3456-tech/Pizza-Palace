import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, deliveryFee, gstTax, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      addToast('Please login to proceed with order placement', 'info');
      navigate('/login?redirect=checkout');
    }
  };

  const handleRemove = (cartKey, name) => {
    removeFromCart(cartKey);
    addToast(`${name} removed from cart`, 'info');
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center px-4"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl mx-auto mb-6">
            <FiShoppingCart />
          </div>
          <h2 className="text-2xl font-extrabold text-neutralDark">Your Cart is Empty</h2>
          <p className="text-neutral-500 font-semibold text-sm mt-2 mb-8 leading-relaxed">
            You haven't added any delicious pizzas to your cart yet. Browse our menu and customize your favorite slice!
          </p>
          <Link 
            to="/menu" 
            className="inline-flex items-center gap-2 bg-primary text-white font-extrabold px-8 py-4 rounded-full hover:bg-primary-dark shadow-md hover:shadow-primary/25 transition-all"
          >
            <span>Browse Menu</span>
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-neutralDark">Your Cart</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mt-1">Review your selections</p>
          </div>
          <button 
            onClick={() => { clearCart(); addToast('Cart cleared', 'info'); }}
            className="text-xs font-bold text-neutral-400 hover:text-rose-600 transition-colors uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>

        {/* 2-Column Checkout flow layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.cartKey}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-3xl p-5 border border-neutralLight-dark flex flex-col sm:flex-row gap-5 items-stretch sm:items-center justify-between shadow-sm"
                >
                  {/* Pizza Info & Image */}
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutralLight-dark shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-neutralDark">{item.name}</h3>
                      <p className="text-xs text-neutral-500 font-semibold capitalize mt-0.5">
                        {item.size} • {item.crust.replace('-', ' ')}
                      </p>
                      {item.toppings.length > 0 && (
                        <p className="text-[10px] text-primary font-bold mt-1 line-clamp-1">
                          + {item.toppings.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 bg-neutralLight border border-neutralLight-dark rounded-full px-3 py-1 shadow-inner">
                      <button 
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded-full transition-colors text-neutral-600"
                      >
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="text-sm font-extrabold text-neutralDark w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-full transition-colors text-neutral-600"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Calculated Price */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-extrabold text-neutralDark">₹{item.price * item.quantity}</span>
                      <p className="text-[10px] text-neutral-400 font-semibold">₹{item.price} each</p>
                    </div>

                    {/* Delete Item */}
                    <button 
                      onClick={() => handleRemove(item.cartKey, item.name)}
                      className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pricing Summary Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex flex-col gap-6"
          >
            <h3 className="font-extrabold text-lg text-neutralDark border-b pb-4">Order Summary</h3>
            
            <div className="flex flex-col gap-3 font-semibold text-sm text-neutral-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-neutralDark font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-extrabold uppercase tracking-wide text-xs mt-0.5">Free Delivery</span>
                ) : (
                  <span className="text-neutralDark font-bold">₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="text-neutralDark font-bold">₹{gstTax}</span>
              </div>
            </div>

            {deliveryFee > 0 && (
              <div className="bg-amber-50 text-amber-800 rounded-2xl p-4 text-xs font-semibold leading-relaxed border border-amber-100">
                💡 Add <span className="font-bold">₹{1000 - subtotal}</span> more to get <span className="font-bold">FREE DELIVERY</span>!
              </div>
            )}

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-base font-extrabold text-neutralDark">Grand Total</span>
              <span className="text-2xl font-extrabold text-primary">₹{totalAmount}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-extrabold py-4 rounded-xl hover:bg-primary-dark shadow-md hover:shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </button>

            <Link 
              to="/menu" 
              className="text-center font-bold text-xs text-neutral-400 hover:text-primary transition-colors uppercase tracking-wider"
            >
              Continue Shopping
            </Link>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
