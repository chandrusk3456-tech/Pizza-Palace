import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2, FiLoader } from 'react-icons/fi';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const PizzaFormModal = ({ isOpen, onClose, pizza, onSaved }) => {
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [category, setCategory] = useState('veg');
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Toppings subform
  const [toppings, setToppings] = useState([]);
  const [newToppingName, setNewToppingName] = useState('');
  const [newToppingPrice, setNewToppingPrice] = useState(30);
  const [newToppingIsVeg, setNewToppingIsVeg] = useState(true);

  // Pre-fill fields if editing existing pizza
  useEffect(() => {
    if (pizza) {
      setName(pizza.name);
      setDescription(pizza.description);
      setImage(pizza.image);
      setBasePrice(pizza.basePrice);
      setCategory(pizza.category);
      setIsAvailable(pizza.isAvailable);
      setToppings(pizza.toppings || []);
    } else {
      setName('');
      setDescription('');
      setImage('');
      setBasePrice(199);
      setCategory('veg');
      setIsAvailable(true);
      setToppings([]);
    }
  }, [pizza, isOpen]);

  const handleAddTopping = (e) => {
    e.preventDefault();
    if (!newToppingName) return;

    // Check if topping already exists
    if (toppings.some(t => t.name.toLowerCase() === newToppingName.toLowerCase())) {
      addToast('Topping already exists', 'error');
      return;
    }

    setToppings(prev => [
      ...prev, 
      { name: newToppingName, price: Number(newToppingPrice), isVeg: newToppingIsVeg }
    ]);
    // Reset inputs
    setNewToppingName('');
    setNewToppingPrice(30);
    setNewToppingIsVeg(true);
  };

  const handleRemoveTopping = (nameToRemove) => {
    setToppings(prev => prev.filter(t => t.name !== nameToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !image || basePrice <= 0) {
      addToast('Please fill all required pizza details', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const pizzaPayload = {
        name,
        description,
        image,
        basePrice: Number(basePrice),
        category,
        isAvailable,
        toppings
      };

      if (pizza) {
        // Edit mode
        await api.put(`/pizzas/${pizza._id}`, pizzaPayload);
        addToast('Pizza details updated!', 'success');
      } else {
        // Add mode
        await api.post('/pizzas', pizzaPayload);
        addToast('New Pizza added to menu!', 'success');
      }

      onSaved();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save pizza';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
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
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-neutralLight-dark shrink-0">
                <h3 className="text-lg font-extrabold text-neutralDark">
                  {pizza ? 'Edit Pizza Details' : 'Add New Pizza'}
                </h3>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-neutralLight rounded-full transition-colors text-neutral-500 hover:text-neutralDark"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 flex flex-col gap-5 text-left">
                
                {/* Name */}
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Pizza Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Garlic Veggie Supreme"
                    className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Description *</label>
                  <textarea 
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe crust, sauce, and key ingredients..."
                    className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Image URL *</label>
                  <input 
                    type="url" 
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Base Price (₹) *</label>
                    <input 
                      type="number" 
                      required
                      min={10}
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark cursor-pointer"
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                      <option value="sweet">Sweet/Dessert</option>
                    </select>
                  </div>
                </div>

                {/* Availability Switch */}
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isAvailableSelect"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isAvailableSelect" className="text-xs font-bold text-neutralDark cursor-pointer select-none">Available and In Stock</label>
                </div>

                {/* Toppings Subform block */}
                <div className="border-t border-neutralLight-dark pt-4 mt-2">
                  <h4 className="text-xs font-extrabold text-neutralDark uppercase tracking-wider mb-3">Toppings Settings</h4>
                  
                  {/* Toppings Addition subform inputs */}
                  <div className="bg-neutralLight p-4 rounded-2xl flex flex-col gap-3 mb-4 border">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] uppercase font-extrabold text-neutral-400 block mb-1">Topping Name</label>
                        <input 
                          type="text" 
                          value={newToppingName}
                          onChange={(e) => setNewToppingName(e.target.value)}
                          placeholder="e.g. Baby Corn"
                          className="w-full bg-white border border-neutralLight-dark rounded-lg px-3 py-1.5 font-sans text-xs focus:outline-none focus:border-primary text-neutralDark"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase font-extrabold text-neutral-400 block mb-1">Price Adjust (₹)</label>
                        <input 
                          type="number" 
                          value={newToppingPrice}
                          onChange={(e) => setNewToppingPrice(e.target.value)}
                          className="w-full bg-white border border-neutralLight-dark rounded-lg px-3 py-1.5 font-sans text-xs focus:outline-none focus:border-primary text-neutralDark"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newToppingIsVeg}
                          onChange={(e) => setNewToppingIsVeg(e.target.checked)}
                          className="accent-primary w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-[10px] font-bold text-neutralDark-light">Vegetarian Topping</span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={handleAddTopping}
                        className="flex items-center gap-1 bg-secondary text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg hover:bg-secondary-dark"
                      >
                        <FiPlus /> Add Topping
                      </button>
                    </div>
                  </div>

                  {/* Toppings tags list */}
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
                    {toppings.length === 0 ? (
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">No custom toppings added yet</span>
                    ) : (
                      toppings.map((t, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-1.5 bg-white border rounded-full pl-3 pr-2 py-1 text-[10px] font-extrabold text-neutralDark-light"
                        >
                          <span className={t.isVeg ? 'text-emerald-600' : 'text-rose-600'}>●</span>
                          <span>{t.name} (₹{t.price})</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTopping(t.name)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors ml-1 p-0.5 rounded-full hover:bg-rose-50"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Form Footer Action */}
                <div className="border-t border-neutralLight-dark pt-5 mt-4 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-bold text-neutral-400 hover:text-neutralDark py-2.5 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-primary-dark shadow-md flex items-center gap-2"
                  >
                    {submitting && <FiLoader className="animate-spin" />}
                    <span>{pizza ? 'Update Pizza' : 'Create Pizza'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PizzaFormModal;
