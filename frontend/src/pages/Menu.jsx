import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSearchParams } from 'react-router-dom';
import PizzaCard from '../components/pizza/PizzaCard';
import CustomizationModal from '../components/pizza/CustomizationModal';
import SkeletonCard from '../components/common/SkeletonCard';
import { FiSearch, FiSliders, FiArrowDown, FiArrowUp, FiAlertCircle } from 'react-icons/fi';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Menu filters/query states
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rating');

  // Customization modal state
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Synchronize category with url search params if changed
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchPizzas = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/pizzas', {
          params: { category, search, sort }
        });
        setPizzas(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch the pizza catalog. Make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const delayDebounce = setTimeout(() => {
      fetchPizzas();
    }, search ? 300 : 0);

    return () => clearTimeout(delayDebounce);
  }, [category, search, sort]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchParams(newCategory === 'all' ? {} : { category: newCategory });
  };

  const handleOpenCustomize = (pizza) => {
    setSelectedPizza(pizza);
    setModalOpen(true);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutralDark">Our Artisan Menu</h1>
          <p className="text-neutral-500 text-sm mt-1 font-semibold">Explore our hand-stretched sourdough pizzas and sweet desserts</p>
        </div>

        {/* Controls Bar: Search, Category Filters & Sort */}
        <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between mb-8 pb-6 border-b border-neutralLight-dark">
          {/* Category Tabs */}
          <div className="flex items-center overflow-x-auto gap-2 py-1 scrollbar-none font-bold text-xs">
            {['all', 'veg', 'non-veg', 'sweet'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-full border transition-all uppercase tracking-wider shrink-0 ${
                  category === cat
                    ? 'bg-primary border-primary text-white shadow-md'
                    : 'bg-white border-neutralLight-dark text-neutralDark hover:bg-neutralLight'
                }`}
              >
                {cat === 'all' ? 'All Pizzas' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Search & Sort Panel */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center font-bold text-xs">
            {/* Search Box */}
            <div className="relative">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pizzas..."
                className="w-full sm:w-60 bg-white border border-neutralLight-dark rounded-full py-2.5 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-primary transition-colors text-neutralDark placeholder-neutral-400"
              />
              <FiSearch className="absolute left-3.5 top-3.5 text-neutral-400 text-sm" />
            </div>

            {/* Sorting Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-white border border-neutralLight-dark rounded-full py-2.5 pl-4 pr-10 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark cursor-pointer"
              >
                <option value="rating">Sort by: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="absolute right-3.5 pointer-events-none text-neutral-400">
                <FiSliders />
              </div>
            </div>
          </div>
        </div>

        {/* Display Error if exists */}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-6 flex items-center gap-4 text-rose-700 max-w-xl mx-auto my-12">
            <FiAlertCircle className="text-3xl shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wide">Connection Error</h4>
              <p className="text-xs mt-1 leading-relaxed font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Catalog Grid */}
        {!error && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : pizzas.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="text-xl font-bold text-neutralDark">No Pizzas Found</h3>
                <p className="text-neutral-500 text-sm mt-1 font-semibold">Try modifying your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pizzas.map((pizza) => (
                  <PizzaCard 
                    key={pizza._id} 
                    pizza={pizza} 
                    onCustomize={handleOpenCustomize}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pizza Customizer Modal popup */}
      <CustomizationModal
        pizza={selectedPizza}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Menu;
