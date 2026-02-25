const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validate, registerRules, loginRules } = require('../middleware/validators');

// POST /api/v1/auth/register
router.post('/register', registerRules, validate, register);

// POST /api/v1/auth/login
router.post('/login', loginRules, validate, login);

module.exports = router;
