import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, enum: ['small', 'medium', 'large'], required: true },
  crust: { type: String, enum: ['thin', 'thick', 'cheese-burst'], required: true },
  toppings: [{ type: String }],
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
