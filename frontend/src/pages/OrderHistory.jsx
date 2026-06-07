import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheck, FiTruck, FiShoppingBag, FiChevronDown, FiChevronUp, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import Loader from '../components/common/Loader';

const OrderHistory = () => {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const highlightId = searchParams.get('highlight');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState('');

  // Fetch orders from API
  const fetchOrders = async (showToast = false) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/my-orders');
      setOrders(data);
      
      // Auto expand highlighted or newest order
      if (highlightId) {
        setExpandedOrderId(highlightId);
      } else if (data.length > 0 && !expandedOrderId) {
        setExpandedOrderId(data[0]._id);
      }

      if (showToast) {
        addToast('Order tracking refreshed', 'success');
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto refresh status every 20 seconds for tracking
    const interval = setInterval(() => {
      fetchOrders();
    }, 20000);

    return () => clearInterval(interval);
  }, [highlightId]);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? '' : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'preparing': return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  // Timeline helpers
  const timelineSteps = [
    { label: 'Order Placed', statusKey: 'pending', description: 'We have received your order' },
    { label: 'Kitchen Preparing', statusKey: 'preparing', description: 'Your pizza is in the oven' },
    { label: 'Out for Delivery', statusKey: 'out-for-delivery', description: 'Our rider is on the way' },
    { label: 'Delivered', statusKey: 'delivered', description: 'Enjoy your hot pizza slice!' }
  ];

  const getTimelineIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'out-for-delivery': return 2;
      case 'delivered': return 3;
      default: return -1; // cancelled
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-neutralDark">Order Tracking</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mt-1">Monitor order status in real-time</p>
          </div>
          
          <button
            onClick={() => fetchOrders(true)}
            className="flex items-center gap-1.5 bg-white border border-neutralLight-dark rounded-full px-4 py-2 text-xs font-bold text-neutralDark hover:bg-neutralLight hover:text-primary transition-all shadow-sm"
          >
            <FiRefreshCw className="text-xs" />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Orders Listing */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutralLight-dark rounded-3xl p-8 shadow-sm">
            <span className="text-5xl mb-4 block">🍕</span>
            <h3 className="text-xl font-bold text-neutralDark">No Orders Yet</h3>
            <p className="text-neutral-500 text-xs mt-1 mb-8 font-semibold">You haven't ordered any pizzas from us yet.</p>
            <Link 
              to="/menu" 
              className="bg-primary text-white font-extrabold px-8 py-3.5 rounded-full hover:bg-primary-dark shadow-md"
            >
              Order Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const currentStepIdx = getTimelineIndex(order.status);
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div 
                  key={order._id}
                  className={`bg-white rounded-3xl border border-neutralLight-dark overflow-hidden shadow-sm transition-all ${
                    order._id === highlightId ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                >
                  {/* Order Overview Header Banner */}
                  <div 
                    onClick={() => toggleExpand(order._id)}
                    className="p-5 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-neutralLight/40 transition-colors"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FiShoppingBag />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-neutralDark">Order ID: #{order._id.substring(18)}</h4>
                        <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{formattedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Price Tag */}
                      <span className="font-extrabold text-base text-neutralDark">₹{order.totalAmount}</span>
                      
                      {/* Status badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ')}
                      </span>

                      {/* Dropdown Chevron */}
                      {isExpanded ? <FiChevronUp className="text-neutral-400 text-lg" /> : <FiChevronDown className="text-neutral-400 text-lg" />}
                    </div>
                  </div>

                  {/* Expanded Tracker Timeline Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutralLight-dark bg-neutralLight/30 p-6 flex flex-col gap-8 overflow-hidden"
                      >
                        {/* 1. Track Progress timeline graphics */}
                        {order.status === 'cancelled' ? (
                          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold leading-relaxed">
                            ❌ This order was cancelled. If payment was made, a refund has been initiated to your source account.
                          </div>
                        ) : (
                          <div className="py-2">
                            <h5 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest mb-6">Delivery Progress</h5>
                            
                            {/* Tracking line progress UI */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6 md:gap-0">
                              {/* Horizontal progress bar (hidden on mobile) */}
                              <div className="hidden md:block absolute left-6 right-6 top-[22px] h-[3px] bg-neutral-200 z-0">
                                <div 
                                  className="h-full bg-emerald-500 transition-all duration-500" 
                                  style={{ width: `${(currentStepIdx / 3) * 100}%` }}
                                ></div>
                              </div>

                              {timelineSteps.map((step, idx) => {
                                const isDone = idx <= currentStepIdx;
                                const isActive = idx === currentStepIdx;

                                return (
                                  <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 text-left md:text-center z-10 w-full md:w-1/4">
                                    {/* Bubble */}
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all ${
                                      isDone 
                                        ? 'bg-emerald-500 border-white text-white shadow-md' 
                                        : 'bg-white border-neutralLight-dark text-neutral-400'
                                    } ${isActive ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}>
                                      {idx === 0 && <FiShoppingBag />}
                                      {idx === 1 && <FiClock />}
                                      {idx === 2 && <FiTruck />}
                                      {idx === 3 && <FiCheck />}
                                    </div>

                                    {/* Info text */}
                                    <div>
                                      <h6 className={`font-extrabold text-xs ${isDone ? 'text-neutralDark' : 'text-neutral-400'}`}>
                                        {step.label}
                                      </h6>
                                      <p className="text-[10px] text-neutral-400 font-semibold leading-normal mt-0.5 max-w-[120px] mx-auto hidden md:block">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 2. Order items breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutralLight-dark pt-6">
                          <div>
                            <h5 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest mb-4">Items Summary</h5>
                            <div className="flex flex-col gap-3">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-semibold text-neutral-500 bg-white border border-neutralLight-dark rounded-xl p-3 shadow-sm">
                                  <div>
                                    <span className="font-extrabold text-neutralDark">{item.name}</span>
                                    <span className="text-neutral-400"> x{item.quantity}</span>
                                    <p className="text-[9px] text-neutral-400 capitalize">{item.size} • {item.crust}</p>
                                    {item.toppings.length > 0 && (
                                      <p className="text-[9px] text-primary font-bold mt-0.5">+ {item.toppings.join(', ')}</p>
                                    )}
                                  </div>
                                  <span className="font-extrabold text-neutralDark">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address & Payment Info */}
                          <div className="flex flex-col gap-5">
                            <div>
                              <h5 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest mb-3">Delivery To</h5>
                              <div className="text-xs text-neutral-500 font-semibold bg-white border border-neutralLight-dark rounded-xl p-4 shadow-sm leading-relaxed">
                                <p className="font-bold text-neutralDark">{order.deliveryAddress.street}</p>
                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}</p>
                                <p className="mt-1 font-bold text-neutralDark">Phone: {order.deliveryAddress.phone}</p>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-extrabold text-xs text-neutral-400 uppercase tracking-widest mb-3">Billing & Payment</h5>
                              <div className="text-xs text-neutral-500 font-semibold bg-white border border-neutralLight-dark rounded-xl p-4 shadow-sm flex justify-between items-center">
                                <div>
                                  <p className="capitalize font-bold text-neutralDark">Method: {order.paymentMethod.toUpperCase()}</p>
                                  <p className="capitalize text-[10px] mt-0.5">Status: <span className={order.paymentStatus === 'paid' ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>{order.paymentStatus}</span></p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Total Paid</p>
                                  <p className="text-base font-extrabold text-primary">₹{order.totalAmount}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderHistory;
