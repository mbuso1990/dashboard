const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// JSON response route
router.get('/api', productController.getAllProducts);

// EJS rendering route
router.get('/', productController.renderProductsPage);

// Create a new product
router.post('/', productController.createProduct);

// Update a product by ID
router.put('/:id', productController.updateProduct);

module.exports = router;
