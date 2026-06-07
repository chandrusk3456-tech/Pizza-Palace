import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext';
import { FiSliders, FiClock, FiCheckCircle, FiTruck, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AdminOrders = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      addToast('Failed to fetch orders list', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        status: newStatus
      });

      // Update local state list
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status, paymentStatus: data.paymentStatus } : o));
      addToast(`Order status updated to "${newStatus.replace('-', ' ')}"`, 'success');
    } catch (error) {
      addToast('Failed to update status', 'error');
      console.error(error);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? '' : orderId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'preparing': return 'bg-sky-100 text-sky-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  // Filtered orders list
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] bg-neutralLight flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutralDark">Manage Orders</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mt-0.5">Control delivery pipelines & workflow statuses</p>
          </div>

          {/* Filter Pipeline dropdown */}
          <div className="relative font-bold text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-neutralLight-dark rounded-full py-3 pl-4 pr-10 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark cursor-pointer shadow-sm w-full sm:w-48"
            >
              <option value="all">Filter: All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="preparing">Preparing in Kitchen</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-neutral-400">
              <FiSliders />
            </div>
          </div>
        </div>

        {/* Orders List Tables */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-neutralLight-dark shadow-sm">
            <Loader />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutralLight-dark rounded-3xl p-8 shadow-sm">
            <FiAlertCircle className="text-4xl text-neutral-400 mb-2 mx-auto" />
            <h3 className="text-lg font-bold text-neutralDark">No Orders Found</h3>
            <p className="text-neutral-500 text-xs mt-1">There are no orders matching the selected status filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutralLight-dark shadow-sm overflow-hidden select-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutralLight border-b border-neutralLight-dark text-neutral-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <th className="py-4 px-6 w-10"></th>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Grand Total</th>
                    <th className="py-4 px-6">Billing Status</th>
                    <th className="py-4 px-6 text-right">Workflow Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-neutralDark-light">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    });

                    return (
                      <React.Fragment key={order._id}>
                        {/* Summary Row */}
                        <tr 
                          onClick={() => toggleExpand(order._id)}
                          className="hover:bg-neutralLight/20 cursor-pointer border-b last:border-b-0 transition-colors"
                        >
                          <td className="py-4 px-6">
                            {isExpanded ? <FiChevronUp className="text-lg text-neutral-400" /> : <FiChevronDown className="text-lg text-neutral-400" />}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-neutralDark">
                            #{order._id.substring(18)}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-neutralDark">
                            {order.user?.name || 'Guest User'}
                            <span className="text-[10px] text-neutral-400 font-normal block">{order.user?.email || 'no-email'}</span>
                          </td>
                          <td className="py-4 px-6 font-medium text-neutral-400">
                            {dateStr}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-sm text-neutralDark">
                            ₹{order.totalAmount}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                              order.paymentStatus === 'paid' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            {/* Dropdown status modifier */}
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              className={`px-3 py-1.5 border rounded-lg font-sans text-xs font-bold uppercase cursor-pointer focus:outline-none ${getStatusClass(order.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="out-for-delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>

                        {/* Collapsible Details Drawer */}
                        {isExpanded && (
                          <tr className="bg-neutralLight/25">
                            <td colSpan={7} className="p-6 border-b border-neutralLight-dark">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left leading-relaxed">
                                {/* Items */}
                                <div>
                                  <h4 className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-3">Order items</h4>
                                  <div className="flex flex-col gap-2">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="bg-white border rounded-xl p-3 flex justify-between items-center text-xs">
                                        <div>
                                          <span className="font-extrabold text-neutralDark">{item.name}</span>
                                          <span className="text-neutral-400 font-normal"> x{item.quantity}</span>
                                          <p className="text-[9px] text-neutral-400 capitalize">{item.size} • {item.crust}</p>
                                          {item.toppings.length > 0 && (
                                            <p className="text-[9px] text-primary font-bold mt-0.5">+ {item.toppings.join(', ')}</p>
                                          )}
                                        </div>
                                        <span className="font-extrabold text-neutralDark shrink-0">₹{item.price * item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                  <h4 className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-3">Delivery address</h4>
                                  <div className="bg-white border rounded-xl p-4 text-xs font-semibold leading-relaxed text-neutral-500">
                                    <p className="font-bold text-neutralDark">{order.deliveryAddress.street}</p>
                                    <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}</p>
                                    <p className="mt-1 font-bold text-neutralDark">Phone: {order.deliveryAddress.phone}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;
