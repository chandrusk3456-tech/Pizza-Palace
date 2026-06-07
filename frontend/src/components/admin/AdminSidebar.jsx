import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiDatabase, FiGrid, FiShoppingBag, FiArrowLeft, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-neutralDark text-white w-full md:w-64 shrink-0 flex flex-col justify-between py-8 px-6 border-r border-white/5 md:min-h-[calc(100vh-80px)]">
      <div>
        {/* Admin Profiler info */}
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary font-bold text-sm shrink-0">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
            <h5 className="font-extrabold text-sm text-neutral-100">{user?.name || 'Admin'}</h5>
            <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Chef de Cuisine</p>
          </div>
        </div>

        {/* Links Panel */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 font-bold text-sm">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <FiDatabase />
            <span>Overview Stats</span>
          </NavLink>

          <NavLink 
            to="/admin/pizzas" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <FiGrid />
            <span>Manage Pizzas</span>
          </NavLink>

          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all shrink-0 ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <FiShoppingBag />
            <span>Manage Orders</span>
          </NavLink>
        </div>
      </div>

      {/* Exit Panel */}
      <div className="mt-8 md:mt-auto border-t border-white/5 pt-6 hidden md:block">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-all font-bold text-sm"
        >
          <FiArrowLeft />
          <span>Exit to Store</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
