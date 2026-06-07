import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const CustomizationModal = ({ pizza, isOpen, onClose }) => {
  if (!pizza) return null;

  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedCrust, setSelectedCrust] = useState('thin');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(pizza.basePrice);

  // Reset states when pizza changes
  useEffect(() => {
    if (pizza) {
      setSelectedSize('medium');
      setSelectedCrust('thin');
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [pizza]);

  // Recalculate price dynamically
  useEffect(() => {
    if (!pizza) return;

    let price = pizza.basePrice;

    // Size adjustment
    const sizeObj = pizza.sizes.find(s => s.size === selectedSize);
    if (sizeObj) price += sizeObj.priceAdjust;

    // Crust adjustment
    const crustObj = pizza.crusts.find(c => c.crust === selectedCrust);
    if (crustObj) price += crustObj.priceAdjust;

    // Toppings adjustment
    selectedToppings.forEach(toppingName => {
      const toppingObj = pizza.toppings.find(t => t.name === toppingName);
      if (toppingObj) {
        price += toppingObj.price;
      }
    });

    setTotalPrice(price * quantity);
  }, [selectedSize, selectedCrust, selectedToppings, quantity, pizza]);

  const toggleTopping = (toppingName) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleAddToCart = () => {
    addToCart(pizza, quantity, selectedSize, selectedCrust, selectedToppings);
    addToast(`${pizza.name} (${selectedSize}) added to cart!`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutralDark z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-neutralLight-dark shrink-0">
                <div>
                  <h3 className="text-xl font-extrabold text-neutralDark">{pizza.name}</h3>
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{pizza.category} Category</span>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-neutralLight rounded-full transition-colors text-neutral-500 hover:text-neutralDark"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 flex-1 flex flex-col gap-6">
                {/* Product Image */}
                <div className="h-40 rounded-2xl overflow-hidden bg-neutralLight-dark shrink-0">
                  <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
                </div>

                {/* 1. Size Selection */}
                <div>
                  <h4 className="text-sm font-extrabold text-neutralDark uppercase tracking-wider mb-3">1. Select Size</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {pizza.sizes.map((s) => {
                      const adjust = s.priceAdjust > 0 ? ` (+₹${s.priceAdjust})` : '';
                      return (
                        <button
                          key={s.size}
                          onClick={() => setSelectedSize(s.size)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedSize === s.size
                              ? 'border-primary bg-primary/5 text-primary shadow-sm'
                              : 'border-neutralLight-dark text-neutralDark hover:bg-neutralLight'
                          }`}
                        >
                          <span className="capitalize text-sm">{s.size}</span>
                          <span className="opacity-80 text-[10px]">{adjust || 'Base Price'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Crust Selection */}
                <div>
                  <h4 className="text-sm font-extrabold text-neutralDark uppercase tracking-wider mb-3">2. Select Crust</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {pizza.crusts.map((c) => {
                      const adjust = c.priceAdjust > 0 ? ` (+₹${c.priceAdjust})` : '';
                      return (
                        <button
                          key={c.crust}
                          onClick={() => setSelectedCrust(c.crust)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                            selectedCrust === c.crust
                              ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                              : 'border-neutralLight-dark text-neutralDark hover:bg-neutralLight'
                          }`}
                        >
                          <span className="capitalize text-sm">{c.crust.replace('-', ' ')}</span>
                          <span className="opacity-80 text-[10px]">{adjust || 'No charge'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Extra Toppings */}
                {pizza.toppings && pizza.toppings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-extrabold text-neutralDark uppercase tracking-wider mb-3">3. Add Extra Toppings</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {pizza.toppings.map((t) => {
                        const isChecked = selectedToppings.includes(t.name);
                        return (
                          <div 
                            key={t.name}
                            onClick={() => toggleTopping(t.name)}
                            className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              isChecked
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-neutralLight-dark hover:bg-neutralLight'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => {}} // handled by parent onClick
                                className="accent-primary w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-neutralDark">{t.name}</span>
                            </div>
                            <span className="text-xs font-extrabold text-neutral-500">+₹{t.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Calculations & CTA */}
              <div className="bg-neutralLight border-t border-neutralLight-dark p-6 shrink-0 flex items-center justify-between">
                {/* Quantity adjustments */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center gap-3 bg-white border border-neutralLight-dark rounded-full px-3 py-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-1 hover:bg-neutralLight rounded-full text-neutral-600 transition-colors"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="text-sm font-extrabold text-neutralDark w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-1 hover:bg-neutralLight rounded-full text-neutral-600 transition-colors"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Price and Add button */}
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Price</span>
                    <span className="text-xl font-extrabold text-neutralDark">₹{totalPrice}</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-primary-dark shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;
