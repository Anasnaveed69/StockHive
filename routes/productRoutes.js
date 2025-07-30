const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// All product routes are protected - require authentication
router.use(protect);

// Get all products for the authenticated user
router.get('/products', productController.getAllProducts);

// Search products (must come before /products/:id)
router.get('/products/search', productController.searchProducts);

// Get products by category (must come before /products/:id)
router.get('/products/category/:categoryName', productController.getProductsByCategory);

// Create a new product
router.post('/products', productController.createProduct);

// Get product by ID (must come after specific routes)
router.get('/products/:id', productController.getProductById);

// Update a product
router.put('/products/:id', productController.updateProduct);

// Delete a product
router.delete('/products/:id', productController.deleteProduct);

module.exports = router; 