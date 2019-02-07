const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/verified', authController.verified)
router.post('/keeplogin', authController.keeplogin)




module.exports = router;