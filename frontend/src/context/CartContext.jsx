import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Generate unique item identifier based on pizza ID and options selected
  const getCartItemKey = (pizzaId, size, crust, toppings = []) => {
    const sortedToppings = [...toppings].sort().join(',');
    return `${pizzaId}-${size}-${crust}-${sortedToppings}`;
  };

  // Add pizza to cart
  const addToCart = (pizza, quantity, size, crust, toppings = []) => {
    // Calculate final unit price
    let unitPrice = pizza.basePrice;
    
    // Size adjust
    const sizeAdjust = pizza.sizes.find(s => s.size === size)?.priceAdjust || 0;
    unitPrice += sizeAdjust;

    // Crust adjust
    const crustAdjust = pizza.crusts.find(c => c.crust === crust)?.priceAdjust || 0;
    unitPrice += crustAdjust;

    // Toppings adjust
    toppings.forEach(toppingName => {
      const toppingAdjust = pizza.toppings.find(t => t.name === toppingName)?.price || 30;
      unitPrice += toppingAdjust;
    });

    const cartKey = getCartItemKey(pizza._id, size, crust, toppings);

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.cartKey === cartKey);

      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            cartKey,
            pizza: pizza._id,
            name: pizza.name,
            image: pizza.image,
            basePrice: pizza.basePrice,
            quantity,
            size,
            crust,
            toppings,
            price: unitPrice // snapshot of customized price per unit
          }
        ];
      }
    });
  };

  // Update quantity of an item
  const updateQuantity = (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems((prevItems) => 
      prevItems.map(item => item.cartKey === cartKey ? { ...item, quantity: newQuantity } : item)
    );
  };

  // Remove item from cart
  const removeFromCart = (cartKey) => {
    setCartItems((prevItems) => prevItems.filter(item => item.cartKey !== cartKey));
  };

  // Clear all cart contents
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate pricing breakdown
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 && subtotal < 1000 ? 50 : 0; // Free delivery above 1000
  const gstTax = Math.round(subtotal * 0.05); // 5% GST
  const totalAmount = subtotal + deliveryFee + gstTax;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      deliveryFee,
      gstTax,
      totalAmount,
      totalItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
