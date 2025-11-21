const express = require('express');
const { register, login, verifyToken, getUser, updateUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);

module.exports = router;
