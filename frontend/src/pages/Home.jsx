import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiSmile, FiAward, FiClock } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="pt-24 pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <span className="bg-primary/10 text-primary font-extrabold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full w-fit">
            🍕 Hot & Fresh Delivery
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutralDark leading-tight tracking-tight">
            Craving the <br />
            <span className="text-primary">Perfect Slice?</span>
          </h1>
          <p className="text-neutral-500 text-sm sm:text-lg leading-relaxed max-w-xl font-medium">
            Order pizza, pasta, sandwiches & more online for carryout or delivery from Pizza-Palace. View menu, find locations, track orders. Sign up Pizza_palace email ...
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link 
              to="/menu" 
              className="flex items-center gap-2 bg-primary text-white font-extrabold px-8 py-4 rounded-full hover:bg-primary-dark shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
            >
              <span>Explore Menu</span>
              <FiArrowRight />
            </Link>
            <Link 
              to="/order-history" 
              className="flex items-center gap-2 bg-white text-neutralDark border-2 border-neutralLight-dark font-extrabold px-8 py-4 rounded-full hover:bg-neutralLight transition-all"
            >
              <span>Track Active Order</span>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / floating element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[480px] aspect-square rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center p-8">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" 
              alt="Delicious Pizza"
              className="w-full h-full object-cover rounded-full shadow-2xl pulse-red border-8 border-white"
            />
            {/* Float badge 1 */}
            <div className="absolute top-8 left-0 bg-white shadow-xl rounded-2xl p-4 border border-neutralLight-dark flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h5 className="font-extrabold text-xs text-neutralDark">25 Min Delivery</h5>
                <p className="text-[10px] text-neutral-400 font-semibold">Or it's completely free</p>
              </div>
            </div>
            {/* Float badge 2 */}
            <div className="absolute bottom-8 right-0 bg-white shadow-xl rounded-2xl p-4 border border-neutralLight-dark flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h5 className="font-extrabold text-xs text-neutralDark">Woodfired Oven</h5>
                <p className="text-[10px] text-neutral-400 font-semibold">450°C traditional baking</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Promo Section */}
      <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto mb-12">
            <span className="text-secondary font-extrabold text-xs uppercase tracking-widest">Trending Offers</span>
            <h2 className="text-3xl font-extrabold text-neutralDark mt-2">Palace Special Deals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <span className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">Veg Special</span>
                <h3 className="text-xl font-extrabold mt-4 text-neutralDark">Free Extra Cheese</h3>
                <p className="text-neutral-500 text-xs mt-2 leading-relaxed font-medium">Add extra double mozzarella to any medium or large Veggie Pizza. Use code: CHEESYFREE</p>
              </div>
              <Link to="/menu?category=veg" className="mt-6 text-primary font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all">
                <span>Order Veggies</span>
                <FiArrowRight />
              </Link>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <span className="bg-secondary text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">Weekend Deal</span>
                <h3 className="text-xl font-extrabold mt-4 text-neutralDark">20% Off Orders Above ₹599</h3>
                <p className="text-neutral-500 text-xs mt-2 leading-relaxed font-medium">Enjoy our premium pizzas at an incredible discount this weekend. Use code: WEEKEND20</p>
              </div>
              <Link to="/menu" className="mt-6 text-secondary font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all">
                <span>View Menu</span>
                <FiArrowRight />
              </Link>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <span className="bg-rose-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">Carnivore Feast</span>
                <h3 className="text-xl font-extrabold mt-4 text-neutralDark">Buy 1 Get 1 Free Pepperoni</h3>
                <p className="text-neutral-500 text-xs mt-2 leading-relaxed font-medium">Buy any large Pepperoni Feast, and get another medium Pepperoni Feast free. Code: PEPPERONILOVE</p>
              </div>
              <Link to="/menu?category=non-veg" className="mt-6 text-primary font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all">
                <span>Order Pepperoni</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-lg mx-auto mb-16">
          <span className="text-primary font-extrabold text-xs uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutralDark mt-2">Crafting Better Pizza Experience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Card */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary text-3xl mb-6 shadow-inner">
              <FiAward />
            </div>
            <h4 className="font-extrabold text-lg text-neutralDark mb-2">Artificial Pizza</h4>
            <p className="text-neutral-500 text-sm leading-relaxed font-medium">Our pizzas are hand-stretched and prepared by certified pizza with decades of experience.</p>
          </div>
          {/* Card */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary text-3xl mb-6 shadow-inner">
              <FiTruck />
            </div>
            <h4 className="font-extrabold text-lg text-neutralDark mb-2">Fast Hot Delivery</h4>
            <p className="text-neutral-500 text-sm leading-relaxed font-medium">Shipped inside specially insulated thermally-regulated bags to ensure your pizza is hot upon arrival.</p>
          </div>
          {/* Card */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary text-3xl mb-6 shadow-inner">
              <FiSmile />
            </div>
            <h4 className="font-extrabold text-lg text-neutralDark mb-2">100% Quality Guarantee</h4>
            <p className="text-neutral-500 text-sm leading-relaxed font-medium">Not satisfied with your crust, sauce, or toppings? We will replace or refund it immediately.</p>
          </div>
          {/* Card */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-3xl bg-secondary/5 flex items-center justify-center text-secondary text-3xl mb-6 shadow-inner">
              <FiClock />
            </div>
            <h4 className="font-extrabold text-lg text-neutralDark mb-2">Late Night Cravings</h4>
            <p className="text-neutral-500 text-sm leading-relaxed font-medium">Open until 1:00 AM on weekends to satisfy those midnight pizza cravings.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutralDark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto mb-16">
            <span className="text-secondary font-extrabold text-xs uppercase tracking-widest">Customers Reviews</span>
            <h2 className="text-3xl font-extrabold text-neutral-100 mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card */}
            <div className="bg-neutralDark-light border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between">
              <p className="text-neutral-300 text-sm leading-relaxed italic mb-6">
                "Honestly, the best pizza I've had outside Naples. The crust was bubbly, chewy, and charred beautifully. The cheese-burst option is out of this world!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-extrabold text-sm text-white">
                  MS
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-neutral-100">Marcus Sterling</h5>
                  <p className="text-[10px] text-neutral-500 font-semibold">Verified Food Critic</p>
                </div>
              </div>
            </div>
            {/* Card */}
            <div className="bg-neutralDark-light border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between">
              <p className="text-neutral-300 text-sm leading-relaxed italic mb-6">
                "The delivery is exceptionally fast! My pizza arrived in 20 minutes, steaming hot, and the pepperoni slices were super crispy. Pizza Palace is my absolute go-to."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-extrabold text-sm text-white">
                  AH
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-neutral-100">Amara Hayes</h5>
                  <p className="text-[10px] text-neutral-500 font-semibold">Local Customer</p>
                </div>
              </div>
            </div>
            {/* Card */}
            <div className="bg-neutralDark-light border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between">
              <p className="text-neutral-300 text-sm leading-relaxed italic mb-6">
                "I ordered the Nutella S'mores Pizza for my daughter's birthday, and it was a massive hit. Such a unique, mouth-watering dessert. Will definitely order again!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-extrabold text-sm text-white">
                  RD
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-neutral-100">Raymond Davis</h5>
                  <p className="text-[10px] text-neutral-500 font-semibold">Father of two</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
