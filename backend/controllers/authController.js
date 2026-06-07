import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password // Schema pre-save hooks will encrypt it
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req, res, next) => {
  const { street, city, state, zipCode, phone, isDefault } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // If setting as default, make all others not default
      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }

      user.addresses.push({
        street,
        city,
        state,
        zipCode,
        phone,
        isDefault: isDefault || user.addresses.length === 0 // Make default if first address
      });

      const updatedUser = await user.save();
      res.status(201).json(updatedUser.addresses);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
      
      // If we deleted the default address, and we have addresses left, make the first one default
      const hasDefault = user.addresses.some(addr => addr.isDefault);
      if (!hasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      const updatedUser = await user.save();
      res.json(updatedUser.addresses);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PUT /api/auth/address/:addressId/default
// @access  Private
export const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses.forEach(addr => {
        addr.isDefault = addr._id.toString() === req.params.addressId;
      });

      const updatedUser = await user.save();
      res.json(updatedUser.addresses);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
