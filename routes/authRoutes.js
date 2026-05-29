const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], updateMe);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://cartly-b2tu.onrender.com/login.html' }),
  (req, res) => {
    const token = req.user.token;
    const user = encodeURIComponent(JSON.stringify(req.user.user));
    res.redirect(`https://cartly-b2tu.onrender.com/login.html?token=${token}&user=${user}`);
  }
);

module.exports = router;
