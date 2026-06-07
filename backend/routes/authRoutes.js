import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/address')
  .post(protect, addAddress);

router.route('/address/:addressId')
  .delete(protect, deleteAddress);

router.route('/address/:addressId/default')
  .put(protect, setDefaultAddress);

export default router;
