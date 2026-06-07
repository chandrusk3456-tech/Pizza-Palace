import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Pizza from './models/Pizza.js';
import Order from './models/Order.js';

dotenv.config();

const pizzas = [
  {
    name: "Classic Margherita",
    description: "Authentic Italian style hand-stretched crust topped with our signature rich tomato sauce, fresh sliced mozzarella, and fresh sweet basil leaves.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    basePrice: 249,
    category: "veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 100 },
      { size: "large", priceAdjust: 200 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 40 },
      { crust: "cheese-burst", priceAdjust: 90 }
    ],
    toppings: [
      { name: "Extra Cheese", price: 60, isVeg: true },
      { name: "Mushrooms", price: 40, isVeg: true },
      { name: "Olives", price: 30, isVeg: true }
    ],
    rating: 4.8,
    reviewsCount: 124
  },
  {
    name: "Double Cheese Margherita",
    description: "For the cheese lovers. A thick layer of premium stringy mozzarella cheese over our classic signature marinara tomato sauce.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
    basePrice: 329,
    category: "veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 120 },
      { size: "large", priceAdjust: 220 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 40 },
      { crust: "cheese-burst", priceAdjust: 90 }
    ],
    toppings: [
      { name: "Jalapenos", price: 30, isVeg: true },
      { name: "Sweet Corn", price: 30, isVeg: true },
      { name: "Extra Cheese", price: 60, isVeg: true }
    ],
    rating: 4.6,
    reviewsCount: 88
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded to the brim with double layers of crispy, spicy pepperoni slices, loaded mozzarella cheese, and freshly grated parmesan.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    basePrice: 449,
    category: "non-veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 150 },
      { size: "large", priceAdjust: 280 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 45 },
      { crust: "cheese-burst", priceAdjust: 95 }
    ],
    toppings: [
      { name: "Extra Pepperoni", price: 90, isVeg: false },
      { name: "Bacon Strips", price: 80, isVeg: false },
      { name: "Extra Cheese", price: 60, isVeg: true }
    ],
    rating: 4.9,
    reviewsCount: 231
  },
  {
    name: "Veggie Supreme",
    description: "A garden fresh medley of red onions, crisp green bell peppers, sliced button mushrooms, black olives, and juicy sweet corn kernels.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    basePrice: 389,
    category: "veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 110 },
      { size: "large", priceAdjust: 210 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 40 },
      { crust: "cheese-burst", priceAdjust: 90 }
    ],
    toppings: [
      { name: "Mushrooms", price: 40, isVeg: true },
      { name: "Onions", price: 30, isVeg: true },
      { name: "Bell Peppers", price: 30, isVeg: true }
    ],
    rating: 4.7,
    reviewsCount: 152
  },
  {
    name: "BBQ Chicken & Bacon",
    description: "Smoky hickory barbecue sauce base, topped with tender grilled chicken breast chunks, crispy bacon strips, red onions, and fresh cilantro.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    basePrice: 479,
    category: "non-veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 140 },
      { size: "large", priceAdjust: 260 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 45 },
      { crust: "cheese-burst", priceAdjust: 95 }
    ],
    toppings: [
      { name: "Grilled Chicken", price: 70, isVeg: false },
      { name: "Bacon Strips", price: 80, isVeg: false },
      { name: "Jalapenos", price: 30, isVeg: true }
    ],
    rating: 4.8,
    reviewsCount: 194
  },
  {
    name: "Paneer Tikka Pizza",
    description: "Rich Indian spiced Paneer Tikka cubes, green bell pepper, red onions, and hot green chillies, drizzled with mint mayo sauce.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    basePrice: 369,
    category: "veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 110 },
      { size: "large", priceAdjust: 210 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 40 },
      { crust: "cheese-burst", priceAdjust: 90 }
    ],
    toppings: [
      { name: "Extra Paneer", price: 60, isVeg: true },
      { name: "Green Chillies", price: 20, isVeg: true },
      { name: "Onions", price: 30, isVeg: true }
    ],
    rating: 4.5,
    reviewsCount: 94
  },
  {
    name: "Sweet Honey Pineapple",
    description: "Classic tropical pairing of juicy sweet pineapples, smoky honey-glazed ham slices, and sharp jalapenos on a rich mozzarella base.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    basePrice: 349,
    category: "non-veg",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 120 },
      { size: "large", priceAdjust: 220 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 40 },
      { crust: "cheese-burst", priceAdjust: 90 }
    ],
    toppings: [
      { name: "Pineapple Extra", price: 40, isVeg: true },
      { name: "Jalapenos", price: 30, isVeg: true },
      { name: "Ham Slices", price: 60, isVeg: false }
    ],
    rating: 4.4,
    reviewsCount: 65
  },
  {
    name: "Nutella S'mores Pizza",
    description: "Sweet golden crust slathered with rich, warm Nutella chocolate spread, topped with toasted fluffy marshmallows and crushed graham cracker crumbs.",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80",
    basePrice: 299,
    category: "sweet",
    sizes: [
      { size: "small", priceAdjust: 0 },
      { size: "medium", priceAdjust: 90 },
      { size: "large", priceAdjust: 170 }
    ],
    crusts: [
      { crust: "thin", priceAdjust: 0 },
      { crust: "thick", priceAdjust: 30 }
    ],
    toppings: [
      { name: "Extra Nutella", price: 50, isVeg: true },
      { name: "Marshmallows", price: 30, isVeg: true },
      { name: "Banana Slices", price: 30, isVeg: true }
    ],
    rating: 4.7,
    reviewsCount: 74
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza_palace');
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Pizza.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing collections.');

    // Seed pizzas
    const seededPizzas = await Pizza.insertMany(pizzas);
    console.log(`Seeded ${seededPizzas.length} Pizzas.`);

    // Create Admin User
    const adminUser = new User({
      name: 'Chef Mario (Admin)',
      email: 'admin@pizzapalace.com',
      password: 'adminpassword123', // gets hashed automatically
      role: 'admin'
    });
    await adminUser.save();
    console.log('Seeded Admin User: admin@pizzapalace.com / adminpassword123');

    // Create Customer User
    const customerUser = new User({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'customerpassword123', // gets hashed automatically
      role: 'customer',
      addresses: [
        {
          street: '123 Baker Street, Flat 4B',
          city: 'London',
          state: 'Greater London',
          zipCode: 'NW1 6XE',
          phone: '+44 7911 123456',
          isDefault: true
        }
      ]
    });
    await customerUser.save();
    console.log('Seeded Customer User: john@gmail.com / customerpassword123');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
