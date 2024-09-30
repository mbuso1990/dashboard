const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// POST create a new order
router.post('/', orderController.createOrder);

// GET a specific order by ID
router.get('/:id', orderController.getOrderById);

// PATCH update order status by ID
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
