import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true
  },
  priceAdjust: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const crustSchema = new mongoose.Schema({
  crust: {
    type: String,
    enum: ['thin', 'thick', 'cheese-burst'],
    required: true
  },
  priceAdjust: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const toppingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 30
  },
  isVeg: {
    type: Boolean,
    required: true,
    default: true
  }
}, { _id: false });

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required']
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg', 'sweet', 'custom'],
    required: [true, 'Category is required']
  },
  sizes: {
    type: [sizeSchema],
    default: [
      { size: 'small', priceAdjust: 0 },
      { size: 'medium', priceAdjust: 100 },
      { size: 'large', priceAdjust: 200 }
    ]
  },
  crusts: {
    type: [crustSchema],
    default: [
      { crust: 'thin', priceAdjust: 0 },
      { crust: 'thick', priceAdjust: 40 },
      { crust: 'cheese-burst', priceAdjust: 90 }
    ]
  },
  toppings: {
    type: [toppingSchema],
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 12
  }
}, {
  timestamps: true
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

export default Pizza;
