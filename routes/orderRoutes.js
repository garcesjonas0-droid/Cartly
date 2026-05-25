const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
 
router.post('/', verifyToken, placeOrder);
router.get('/myorders', verifyToken, getMyOrders);
router.get('/', verifyToken, adminOnly, getAllOrders);
 
// User can cancel their own pending/processing orders
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
 
    // Make sure the order belongs to this user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this order.' });
    }
 
    // Only allow cancel if pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}.` });
    }
 
    order.status = 'cancelled';
    await order.save();
 
    res.json({ message: 'Order cancelled successfully.', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});
 
// Admin only routes
router.put('/:id', verifyToken, adminOnly, updateOrderStatus);
router.delete('/:id', verifyToken, adminOnly, deleteOrder);
 
module.exports = router;