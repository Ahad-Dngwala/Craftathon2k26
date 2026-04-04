const express = require('express');
const router = express.Router();
const { adminLogin, adminLogout, verifyToken } = require('../controllers/auth.controller');
const { requireAdmin } = require('../middlewares/auth');

// Public - admin login
router.post('/login', adminLogin);

// Public - admin logout
router.post('/logout', adminLogout);

// Protected - verify token
router.get('/verify', requireAdmin, verifyToken);

module.exports = router;
