import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus,
  getDashboardStats
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/stats/dashboard')
  .get(protect, admin, getDashboardStats);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
