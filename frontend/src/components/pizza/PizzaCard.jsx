import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiChevronRight, FiPlus } from 'react-icons/fi';

const PizzaCard = ({ pizza, onCustomize }) => {
  const isVeg = pizza.category === 'veg';
  const isSweet = pizza.category === 'sweet';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl overflow-hidden border border-neutralLight-dark hover:border-primary/20 p-5 flex flex-col justify-between pizza-card-shadow transition-all duration-300 group"
    >
      <div>
        {/* Pizza Image container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutralLight-dark mb-4">
          <img 
            src={pizza.image} 
            alt={pizza.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {/* Badge overlays */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            {isSweet ? (
              <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                🍫 Dessert
              </span>
            ) : isVeg ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Veg
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 border border-rose-300 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Non-Veg
              </span>
            )}
            
            {!pizza.isAvailable && (
              <span className="bg-neutralDark/80 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold mb-1">
          <FiStar className="fill-amber-500" />
          <span>{pizza.rating.toFixed(1)}</span>
          <span className="text-neutral-400 text-xs font-normal">({pizza.reviewsCount} reviews)</span>
        </div>

        {/* Pizza Title */}
        <Link to={`/pizza/${pizza._id}`} className="block">
          <h3 className="text-lg font-bold text-neutralDark group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {pizza.name}
          </h3>
        </Link>

        {/* Pizza Description */}
        <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {pizza.description}
        </p>
      </div>

      {/* Pricing and Action row */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutralLight/70">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Starts at</span>
          <span className="text-lg font-extrabold text-neutralDark">₹{pizza.basePrice}</span>
        </div>

        {pizza.isAvailable ? (
          <button 
            onClick={() => onCustomize(pizza)}
            className="flex items-center gap-1 bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-full hover:bg-primary-dark transition-all hover:scale-105 shadow-sm active:scale-95"
          >
            <FiPlus className="text-base" />
            <span>Customize</span>
          </button>
        ) : (
          <button 
            disabled 
            className="bg-neutral-200 text-neutral-400 font-bold text-xs px-4 py-2.5 rounded-full cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PizzaCard;
