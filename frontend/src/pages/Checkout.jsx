import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiDollarSign, FiPlus, FiTrash2, FiCheckCircle, FiLoader } from 'react-icons/fi';

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, gstTax, totalAmount, clearCart } = useCart();
  const { user, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefaultAddr, setIsDefaultAddr] = useState(false);

  // Selected details
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Card details mock inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Submit process
  const [processing, setProcessing] = useState(false);

  // Set initial selected address to user default address if exists
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [user]);

  // Handle address form submission
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !phone) {
      addToast('Please fill all address fields', 'error');
      return;
    }

    const res = await addAddress({ street, city, state, zipCode, phone, isDefault: isDefaultAddr });
    if (res.success) {
      addToast('Address added successfully!', 'success');
      setShowAddressForm(false);
      // Reset fields
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setPhone('');
      setIsDefaultAddr(false);
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleDeleteAddress = async (e, addrId) => {
    e.stopPropagation(); // prevent select action
    const res = await deleteAddress(addrId);
    if (res.success) {
      addToast('Address removed', 'info');
      if (selectedAddressId === addrId) {
        setSelectedAddressId('');
      }
    }
  };

  const handleSetDefault = async (e, addrId) => {
    e.stopPropagation();
    await setDefaultAddress(addrId);
    addToast('Default address updated', 'success');
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      addToast('Please select a delivery address', 'error');
      return;
    }

    const deliveryAddress = user.addresses.find(a => a._id === selectedAddressId);
    if (!deliveryAddress) {
      addToast('Selected address is invalid', 'error');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        addToast('Please fill all card details', 'error');
        return;
      }
      if (cardNumber.length < 16 || cardCvv.length < 3) {
        addToast('Please enter valid card information', 'error');
        return;
      }
    }

    setProcessing(true);

    try {
      // Create request payload
      const orderPayload = {
        items: cartItems.map(item => ({
          pizza: item.pizza,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          crust: item.crust,
          toppings: item.toppings,
          price: item.price
        })),
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zipCode: deliveryAddress.zipCode,
          phone: deliveryAddress.phone
        },
        paymentMethod
      };

      // Mock delay if card payment
      if (paymentMethod === 'card') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 8000 * 0.1)); // quick mock delay
      }

      const { data } = await axios.post('http://localhost:5000/api/orders', orderPayload);
      
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate(`/order-history?highlight=${data._id}`);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to place order';
      addToast(msg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-16 text-center">
        <h2 className="text-2xl font-bold">No Items to Checkout</h2>
        <Link to="/menu" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-neutralDark">Secure Checkout</h1>
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mt-1">Complete your delivery & billing details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Checkout Steps Form Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. Address Block */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-extrabold text-neutralDark flex items-center gap-2">
                  <FiMapPin className="text-primary text-xl" />
                  <span>1. Delivery Address</span>
                </h3>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-all uppercase tracking-wider"
                  >
                    <FiPlus /> Add New
                  </button>
                )}
              </div>

              {/* Show address form if triggered */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-5 border border-primary/20 rounded-2xl bg-primary/5 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-neutralDark">New Delivery Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Street Address / Flat No.</label>
                      <input 
                        type="text" 
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. 12 Baker Street, Flat 3C"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">City</label>
                      <input 
                        type="text" 
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="London"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">State / Province</label>
                      <input 
                        type="text" 
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Greater London"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">ZIP / Postal Code</label>
                      <input 
                        type="text" 
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="NW1 6XE"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7911 123456"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-primary text-neutralDark"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutralLight-dark">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isDefaultAddr}
                        onChange={(e) => setIsDefaultAddr(e.target.checked)}
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-neutralDark">Set as default address</span>
                    </label>

                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddressForm(false)}
                        className="text-xs font-bold text-neutral-400 hover:text-neutralDark py-2 px-3 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-primary text-white font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-primary-dark"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Saved Address List Selector */}
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {user.addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-4 border-2 rounded-2xl cursor-pointer flex justify-between items-start transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-neutralLight-dark hover:bg-neutralLight'
                        }`}
                      >
                        <div className="flex gap-3">
                          <input 
                            type="radio" 
                            name="addressSelect"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="accent-primary mt-1 cursor-pointer"
                          />
                          <div className="font-semibold text-xs leading-relaxed text-neutral-500">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-neutralDark text-sm">Delivery Address</span>
                              {addr.isDefault && (
                                <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">DEFAULT</span>
                              )}
                            </div>
                            <p className="mt-1 font-bold text-neutralDark">{addr.street}</p>
                            <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                            <p className="mt-1 font-bold text-neutralDark">{addr.phone}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={(e) => handleDeleteAddress(e, addr._id)}
                            className="p-2 text-neutral-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50"
                          >
                            <FiTrash2 />
                          </button>
                          {!addr.isDefault && (
                            <button
                              onClick={(e) => handleSetDefault(e, addr._id)}
                              className="text-[9px] font-bold text-primary hover:underline"
                            >
                              Make Default
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-neutralLight-dark rounded-2xl flex flex-col items-center">
                  <span className="text-3xl mb-2">📍</span>
                  <h5 className="font-bold text-neutralDark text-sm">No Saved Addresses</h5>
                  <p className="text-neutral-500 text-xs mt-0.5 mb-4 font-semibold">Please add a delivery address to complete order.</p>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="bg-primary text-white text-xs font-extrabold px-4 py-2 rounded-xl"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* 2. Payment Method Block */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-neutralDark flex items-center gap-2 mb-6">
                <FiCreditCard className="text-secondary text-xl" />
                <span>2. Payment Option</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option COD */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-secondary bg-secondary/5'
                      : 'border-neutralLight-dark hover:bg-neutralLight'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-secondary cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-lg">
                    <FiDollarSign />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-neutralDark">Cash on Delivery</h4>
                    <p className="text-[10px] text-neutral-500 font-semibold">Pay with cash upon arrival</p>
                  </div>
                </div>

                {/* Option Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-secondary bg-secondary/5'
                      : 'border-neutralLight-dark hover:bg-neutralLight'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-secondary cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-lg">
                    <FiCreditCard />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-neutralDark">Credit/Debit Card</h4>
                    <p className="text-[10px] text-neutral-500 font-semibold">Simulated secure payment</p>
                  </div>
                </div>
              </div>

              {/* Card Form inputs */}
              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-5 border border-secondary/20 rounded-2xl bg-secondary/5 flex flex-col gap-4 overflow-hidden"
                >
                  <h4 className="text-xs font-extrabold text-neutralDark uppercase tracking-wider">Card Details</h4>
                  
                  <div>
                    <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Card Number</label>
                    <input 
                      type="text" 
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-mono text-sm tracking-widest focus:outline-none focus:border-secondary text-neutralDark"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-mono text-sm tracking-wider focus:outline-none focus:border-secondary text-neutralDark"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-extrabold text-neutral-400 block mb-1">CVV</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="***"
                        className="w-full bg-white border border-neutralLight-dark rounded-xl px-4 py-2.5 font-mono text-sm tracking-widest focus:outline-none focus:border-secondary text-neutralDark"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Pricing Aggregation and Final place order Action Panel */}
          <div className="flex flex-col gap-6">
            
            {/* Billing breakdown */}
            <div className="bg-white rounded-3xl border border-neutralLight-dark p-6 shadow-sm">
              <h3 className="font-extrabold text-lg text-neutralDark border-b pb-4 mb-4">Order Items</h3>
              
              {/* Short items list */}
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto mb-6 pr-2">
                {cartItems.map((item) => (
                  <div key={item.cartKey} className="flex justify-between items-center text-xs font-semibold text-neutral-500">
                    <div className="w-3/4">
                      <span className="font-bold text-neutralDark">{item.name}</span>
                      <span className="text-neutral-400 font-normal"> x{item.quantity}</span>
                      <p className="text-[9px] text-neutral-400 capitalize">{item.size} | {item.crust.replace('-', ' ')}</p>
                    </div>
                    <span className="font-extrabold text-neutralDark shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Costs list */}
              <div className="flex flex-col gap-3 font-semibold text-sm text-neutral-500 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutralDark font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-wide">Free</span>
                  ) : (
                    <span className="text-neutralDark font-bold">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>GST Tax (5%)</span>
                  <span className="text-neutralDark font-bold">₹{gstTax}</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between items-center text-base font-extrabold">
                  <span className="text-neutralDark">Total Amount</span>
                  <span className="text-xl text-primary font-extrabold">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className={`w-full flex items-center justify-center gap-2 text-white font-extrabold py-4 rounded-xl shadow-md transition-all ${
                processing
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark hover:scale-[1.01] hover:shadow-primary/20'
              }`}
            >
              {processing ? (
                <>
                  <FiLoader className="animate-spin text-xl" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-lg" />
                  <span>Place Order (₹{totalAmount})</span>
                </>
              )}
            </button>

            <Link 
              to="/cart" 
              className="text-center font-bold text-xs text-neutral-400 hover:text-neutralDark transition-colors uppercase tracking-wider"
            >
              Back to Cart
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
