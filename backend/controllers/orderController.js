import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  const { items, deliveryAddress, paymentMethod } = req.body;

  try {
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    // Verify and calculate costs
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const pizza = await Pizza.findById(item.pizza);
      if (!pizza) {
        res.status(404);
        throw new Error(`Pizza not found: ${item.name}`);
      }

      // Base price
      let itemPrice = pizza.basePrice;

      // Adjust for size
      const sizeOption = pizza.sizes.find(s => s.size === item.size);
      if (sizeOption) itemPrice += sizeOption.priceAdjust;

      // Adjust for crust
      const crustOption = pizza.crusts.find(c => c.crust === item.crust);
      if (crustOption) itemPrice += crustOption.priceAdjust;

      // Adjust for extra toppings
      if (item.toppings && item.toppings.length > 0) {
        item.toppings.forEach(toppingName => {
          const toppingOption = pizza.toppings.find(t => t.name === toppingName);
          if (toppingOption) {
            itemPrice += toppingOption.price;
          } else {
            // Default flat topping cost if custom
            itemPrice += 30;
          }
        });
      }

      const totalItemPrice = itemPrice * item.quantity;
      calculatedTotal += totalItemPrice;

      validatedItems.push({
        pizza: pizza._id,
        name: pizza.name,
        quantity: item.quantity,
        size: item.size,
        crust: item.crust,
        toppings: item.toppings || [],
        price: itemPrice // Snapshot price per unit
      });
    }

    // Add taxes and delivery fee
    const deliveryFee = 50;
    const gstTax = Math.round(calculatedTotal * 0.05); // 5% GST
    const finalAmount = calculatedTotal + deliveryFee + gstTax;

    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      deliveryAddress,
      totalAmount: finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
      status: 'pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user matches or is admin
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  const { status, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status || order.status;
      order.paymentStatus = paymentStatus || order.paymentStatus;

      // Automatically set payment status to paid if order is delivered
      if (order.status === 'delivered') {
        order.paymentStatus = 'paid';
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    // Total Revenue
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Total Orders Count
    const totalOrders = await Order.countDocuments();

    // Pending Orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Preparing/Out for Delivery
    const activeOrders = await Order.countDocuments({ 
      status: { $in: ['pending', 'preparing', 'out-for-delivery'] } 
    });

    // Delievered Orders
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Recent 6 Orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Sales by Category (Rough aggregation using pizza category)
    // We will query recently completed orders or do a simple structure
    const pizzas = await Pizza.find({});
    const vegCount = pizzas.filter(p => p.category === 'veg').length;
    const nonVegCount = pizzas.filter(p => p.category === 'non-veg').length;

    // Generate weekly sales data (for the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: 'cancelled' }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in days with zero sales so chart looks beautiful
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = salesTrend.find(s => s._id === dateStr);
      dailySales.push({
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        sales: match ? match.sales : 0,
        orders: match ? match.count : 0
      });
    }

    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        activeOrders,
        completedOrders,
        vegCount,
        nonVegCount
      },
      recentOrders,
      dailySales
    });
  } catch (error) {
    next(error);
  }
};
