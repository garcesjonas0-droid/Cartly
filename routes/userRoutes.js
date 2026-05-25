const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// All user management routes require admin
router.use(verifyToken, verifyAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email required')
], updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
