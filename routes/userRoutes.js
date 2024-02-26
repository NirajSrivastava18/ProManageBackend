const express = require('express');
const {
  register,
  login,
  logout,
  UpdatePassword,
  getuserbyid,
} = require('../controllers/userController');

const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', register);

router.post('/login', login);

router.put('/update-password', UpdatePassword);

router.post('/logout', isLoggedIn, logout);

module.exports = router;
