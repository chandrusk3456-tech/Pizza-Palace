import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-neutralDark text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-primary flex items-center gap-1 mb-4">
              🍕 Pizza<span className="text-secondary">Palace</span>
            </span>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Serving premium, wood-fired artisanal pizzas hand-crafted by master pizzaiolos. Taste the difference in every slice.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-primary transition-all hover:scale-110">
                <FiFacebook className="text-lg" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-primary transition-all hover:scale-110">
                <FiInstagram className="text-lg" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-white/5 hover:bg-primary transition-all hover:scale-110">
                <FiTwitter className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-5 text-neutral-100">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-medium text-sm text-neutral-400">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-primary transition-colors">Our Menu</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/order-history" className="hover:text-primary transition-colors">Track Orders</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-bold mb-5 text-neutral-100">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm text-neutral-400 font-medium">
              <li className="flex gap-3">
                <FiMapPin className="text-primary text-lg shrink-0 mt-0.5" />
                <span>456 Chef Lane, Pizza District, London, EC1A 1BB</span>
              </li>
              <li className="flex gap-3">
                <FiPhone className="text-primary text-lg shrink-0" />
                <span>+44 20 7946 0958</span>
              </li>
              <li className="flex gap-3">
                <FiMail className="text-primary text-lg shrink-0" />
                <span>support@pizzapalace.com</span>
              </li>
            </ul>
          </div>

          {/* Hours of Operation */}
          <div>
            <h4 className="text-lg font-bold mb-5 text-neutral-100">Store Hours</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-400 font-medium">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-neutral-200">11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-neutral-200">11:00 AM - 01:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-neutral-200">12:00 PM - 10:00 PM</span>
              </li>
              <li className="flex items-center gap-2 mt-2 text-secondary font-bold text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>WE DELIVER NIGHTLY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs text-neutral-500 font-semibold">
          <p>© {new Date().getFullYear()} Pizza Palace Ltd. All rights reserved. Built with love by Antigravity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
