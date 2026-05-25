const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', verifyToken, adminOnly, createProduct);
router.put('/:id', verifyToken, adminOnly, updateProduct);
router.delete('/:id', verifyToken, adminOnly, deleteProduct);

module.exports = router;