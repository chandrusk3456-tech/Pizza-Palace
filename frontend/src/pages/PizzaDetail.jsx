import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/common/Loader';
import PizzaCard from '../components/pizza/PizzaCard';

const PizzaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [pizza, setPizza] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Customize options state
  const [size, setSize] = useState('medium');
  const [crust, setCrust] = useState('thin');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Fetch pizza details
  useEffect(() => {
    const fetchPizzaData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/pizzas/${id}`);
        setPizza(data);
        setSize('medium');
        setCrust('thin');
        setSelectedToppings([]);
        setQuantity(1);
        setError('');

        // Fetch recommendations (same category, different id)
        const recResponse = await api.get(`/pizzas`, {
          params: { category: data.category }
        });
        setRecommendations(recResponse.data.filter(p => p._id !== data._id).slice(0, 4));
      } catch (err) {
        setError('Pizza not found or server is offline.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzaData();
  }, [id]);

  // Recalculate price
  useEffect(() => {
    if (!pizza) return;

    let base = pizza.basePrice;
    
    const sizeAdjust = pizza.sizes.find(s => s.size === size)?.priceAdjust || 0;
    base += sizeAdjust;

    const crustAdjust = pizza.crusts.find(c => c.crust === crust)?.priceAdjust || 0;
    base += crustAdjust;

    selectedToppings.forEach(toppingName => {
      const toppingObj = pizza.toppings.find(t => t.name === toppingName);
      if (toppingObj) base += toppingObj.price;
    });

    setCalculatedPrice(base * quantity);
  }, [size, crust, selectedToppings, quantity, pizza]);

  const toggleTopping = (toppingName) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleAddToCart = () => {
    addToCart(pizza, quantity, size, crust, selectedToppings);
    addToast(`${pizza.name} (${size}) added to cart!`, 'success');
  };

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <FiAlertCircle className="text-5xl text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-2xl font-extrabold text-neutralDark">Error Occurred</h3>
        <p className="text-neutral-500 font-semibold mt-1 mb-6 max-w-sm">{error}</p>
        <Link to="/menu" className="bg-primary text-white font-extrabold px-6 py-3 rounded-full hover:bg-primary-dark shadow-md">
          Back to Menu
        </Link>
      </div>
    );
  }

  const isVeg = pizza.category === 'veg';
  const isSweet = pizza.category === 'sweet';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-neutralDark hover:text-primary transition-colors font-bold text-sm mb-8 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Core Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Pizza Image Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden bg-white border border-neutralLight-dark shadow-md p-6"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-neutralLight-dark">
              <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-center">
              {/* Category tags */}
              <div className="flex gap-2">
                {isSweet ? (
                  <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full">
                    🍫 Dessert
                  </span>
                ) : isVeg ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Veg
                  </span>
                ) : (
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Non-Veg
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <FiStar className="fill-amber-500 text-lg" />
                <span className="text-base">{pizza.rating.toFixed(1)}</span>
                <span className="text-neutral-400 text-xs font-normal">({pizza.reviewsCount} verified reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-bold text-neutralDark text-sm uppercase tracking-wider mb-2">Details</h3>
              <p className="text-neutral-500 text-sm leading-relaxed font-medium">{pizza.description}</p>
            </div>
          </motion.div>

          {/* Pizza Customizer Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-neutralLight-dark p-6 sm:p-8 shadow-sm flex flex-col gap-8"
          >
            {/* Header info */}
            <div>
              <h2 className="text-3xl font-extrabold text-neutralDark">{pizza.name}</h2>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">Configure & add to order</p>
            </div>

            {/* 1. Size */}
            <div>
              <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-3.5">1. Choose Size</h4>
              <div className="grid grid-cols-3 gap-3">
                {pizza.sizes.map(s => (
                  <button
                    key={s.size}
                    onClick={() => setSize(s.size)}
                    className={`py-3 px-2 border-2 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      size === s.size
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-neutralLight-dark hover:bg-neutralLight text-neutralDark'
                    }`}
                  >
                    <span className="capitalize text-sm">{s.size}</span>
                    <span className="text-[10px] opacity-70">
                      {s.priceAdjust > 0 ? `+₹${s.priceAdjust}` : 'Base Price'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Crust */}
            <div>
              <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-3.5">2. Choose Crust</h4>
              <div className="grid grid-cols-3 gap-3">
                {pizza.crusts.map(c => (
                  <button
                    key={c.crust}
                    onClick={() => setCrust(c.crust)}
                    className={`py-3 px-2 border-2 rounded-2xl font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                      crust === c.crust
                        ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                        : 'border-neutralLight-dark hover:bg-neutralLight text-neutralDark'
                    }`}
                  >
                    <span className="capitalize text-xs leading-none">{c.crust.replace('-', ' ')}</span>
                    <span className="text-[10px] opacity-70">
                      {c.priceAdjust > 0 ? `+₹${c.priceAdjust}` : 'Free'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Extra Toppings */}
            {pizza.toppings && pizza.toppings.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-3.5">3. Add Extra Toppings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pizza.toppings.map(t => {
                    const isChecked = selectedToppings.includes(t.name);
                    return (
                      <div
                        key={t.name}
                        onClick={() => toggleTopping(t.name)}
                        className={`flex justify-between items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          isChecked
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-neutralLight-dark hover:bg-neutralLight'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {}} // handled by parent click
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

            {/* Control Row: Quantity & Order Checkout Add */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutralLight-dark">
              {/* Quantity */}
              <div className="flex items-center gap-3 bg-neutralLight border border-neutralLight-dark rounded-full px-4 py-2 shadow-inner">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1.5 hover:bg-white rounded-full transition-colors text-neutralDark-light"
                >
                  <FiMinus className="text-xs" />
                </button>
                <span className="text-sm font-extrabold text-neutralDark w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1.5 hover:bg-white rounded-full transition-colors text-neutralDark-light"
                >
                  <FiPlus className="text-xs" />
                </button>
              </div>

              {/* Price and Cart Add */}
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Total Price</span>
                  <span className="text-2xl font-extrabold text-neutralDark">₹{calculatedPrice}</span>
                </div>

                {pizza.isAvailable ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-primary-dark shadow-lg hover:shadow-primary/25 transition-all hover:scale-105"
                  >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="bg-neutral-200 text-neutral-400 font-bold text-sm px-8 py-4 rounded-full cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommended Pizzas Carousel */}
        {recommendations.length > 0 && (
          <div className="border-t border-neutralLight-dark pt-16 mt-16">
            <h3 className="text-2xl font-extrabold text-neutralDark mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(p => (
                <PizzaCard 
                  key={p._id} 
                  pizza={p} 
                  onCustomize={() => navigate(`/pizza/${p._id}`)} // Redirect to detail for recommended customization
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaDetail;
