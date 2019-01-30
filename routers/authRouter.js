const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');


router.post('/register', authController.register)
router.post('/signin', authController.signin)
router.post('/verified', authController.verified)

module.exports = router;