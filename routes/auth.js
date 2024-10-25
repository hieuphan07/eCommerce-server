const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// sign up
router.post('/signup', authController.postSignup);

// get login
router.get('/login', authController.getLogin);

// post login
router.post('/login', authController.postLogin);

// log out
router.post('/logout', authController.postLogout);

module.exports = router;

