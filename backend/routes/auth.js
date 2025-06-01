const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middlewares/auth');

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login user
router.post('/login', login);

router.use(auth)
// @route   GET api/auth/me
// @desc    Get current user
router.get('/me', getMe);

module.exports = router;