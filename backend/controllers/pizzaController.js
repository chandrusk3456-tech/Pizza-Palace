import Pizza from '../models/Pizza.js';

// @desc    Get all pizzas with search and filters
// @route   GET /api/pizzas
// @access  Public
export const getPizzas = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let apiQuery = Pizza.find(query);

    // Sorting
    if (sort) {
      if (sort === 'price-low') {
        apiQuery = apiQuery.sort({ basePrice: 1 });
      } else if (sort === 'price-high') {
        apiQuery = apiQuery.sort({ basePrice: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      }
    } else {
      // Default sort by rating high to low
      apiQuery = apiQuery.sort({ rating: -1 });
    }

    const pizzas = await apiQuery;
    res.json(pizzas);
  } catch (error) {
    next(error);
  }
};

// @desc    Get pizza by ID
// @route   GET /api/pizzas/:id
// @access  Public
export const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (pizza) {
      res.json(pizza);
    } else {
      res.status(404);
      throw new Error('Pizza not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a pizza
// @route   POST /api/pizzas
// @access  Private/Admin
export const createPizza = async (req, res, next) => {
  const { name, description, image, basePrice, category, sizes, crusts, toppings } = req.body;

  try {
    const pizzaExists = await Pizza.findOne({ name });

    if (pizzaExists) {
      res.status(400);
      throw new Error('Pizza with that name already exists');
    }

    const pizza = new Pizza({
      name,
      description,
      image,
      basePrice,
      category,
      sizes: sizes || undefined,
      crusts: crusts || undefined,
      toppings: toppings || []
    });

    const createdPizza = await pizza.save();
    res.status(201).json(createdPizza);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pizza
// @route   PUT /api/pizzas/:id
// @access  Private/Admin
export const updatePizza = async (req, res, next) => {
  const { name, description, image, basePrice, category, sizes, crusts, toppings, isAvailable } = req.body;

  try {
    const pizza = await Pizza.findById(req.params.id);

    if (pizza) {
      pizza.name = name || pizza.name;
      pizza.description = description || pizza.description;
      pizza.image = image || pizza.image;
      pizza.basePrice = basePrice !== undefined ? basePrice : pizza.basePrice;
      pizza.category = category || pizza.category;
      pizza.sizes = sizes || pizza.sizes;
      pizza.crusts = crusts || pizza.crusts;
      pizza.toppings = toppings || pizza.toppings;
      pizza.isAvailable = isAvailable !== undefined ? isAvailable : pizza.isAvailable;

      const updatedPizza = await pizza.save();
      res.json(updatedPizza);
    } else {
      res.status(404);
      throw new Error('Pizza not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pizza
// @route   DELETE /api/pizzas/:id
// @access  Private/Admin
export const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (pizza) {
      await pizza.deleteOne();
      res.json({ message: 'Pizza removed successfully' });
    } else {
      res.status(404);
      throw new Error('Pizza not found');
    }
  } catch (error) {
    next(error);
  }
};
