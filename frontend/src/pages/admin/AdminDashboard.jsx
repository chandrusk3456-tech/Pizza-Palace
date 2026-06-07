import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import RevenueChart from '../../components/admin/RevenueChart';
import Loader from '../../components/common/Loader';
import { FiDollarSign, FiShoppingBag, FiTruck, FiCheckSquare, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/stats/dashboard');
      setStats(data.summary);
      setRecentOrders(data.recentOrders);
      setDailySales(data.dailySales);
    } catch (error) {
      console.error('Failed to load dashboard statistics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-[calc(100vh-80px)] flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center bg-neutralLight">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] bg-neutralLight flex flex-col md:flex-row">
      {/* Side navigation */}
      <AdminSidebar />

      {/* Main Stats body */}
      <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutralDark">Overview Panel</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mt-0.5">Real-time statistics & financial status</p>
          </div>
        </div>

        {/* Stats Aggregations grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Card 1: Revenue */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Total Revenue</span>
                <span className="text-2xl font-extrabold text-neutralDark mt-1 block">₹{stats.totalRevenue}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                <FiDollarSign />
              </div>
            </div>

            {/* Card 2: Orders Count */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Total Orders</span>
                <span className="text-2xl font-extrabold text-neutralDark mt-1 block">{stats.totalOrders}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-xl shrink-0">
                <FiShoppingBag />
              </div>
            </div>

            {/* Card 3: Active Orders */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Active Deliveries</span>
                <span className="text-2xl font-extrabold text-neutralDark mt-1 block">{stats.activeOrders}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary/5 text-secondary flex items-center justify-center text-xl shrink-0">
                <FiTruck />
              </div>
            </div>

            {/* Card 4: Completed Deliveries */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Completed Orders</span>
                <span className="text-2xl font-extrabold text-neutralDark mt-1 block">{stats.completedOrders}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
                <FiCheckSquare />
              </div>
            </div>
          </div>
        )}

        {/* Chart and Recent Orders Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart Widget */}
          <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div className="mb-6">
              <h3 className="text-base font-extrabold text-neutralDark">Weekly Sales Trend</h3>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Calculated over last 7 days</p>
            </div>
            <RevenueChart data={dailySales} />
          </div>

          {/* Recent Orders Widget */}
          <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-neutralDark">Recent Orders</h3>
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Latest system placements</p>
                </div>
                <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <FiArrowRight />
                </Link>
              </div>

              {/* Recent Orders list */}
              <div className="flex flex-col gap-4">
                {recentOrders.length === 0 ? (
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider py-8 text-center">No orders placed recently</p>
                ) : (
                  recentOrders.map((ord) => (
                    <div key={ord._id} className="flex justify-between items-center text-xs font-semibold pb-3 border-b last:border-b-0 last:pb-0">
                      <div>
                        <h5 className="font-extrabold text-neutralDark">ID: #{ord._id.substring(18)}</h5>
                        <p className="text-neutral-400 text-[10px] capitalize mt-0.5">
                          {ord.user?.name ? ord.user.name.split(' ')[0] : 'Guest'} • {ord.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-neutralDark block">₹{ord.totalAmount}</span>
                        <span className="text-[9px] uppercase font-bold text-secondary">{ord.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
