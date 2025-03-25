const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getUserOrders
} = require('../controllers/orderController');

// User routes
router.get('/my-orders', verifyToken, getUserOrders);
router.post('/', verifyToken, createOrder);
router.get('/:id', verifyToken, getOrderById);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router; 