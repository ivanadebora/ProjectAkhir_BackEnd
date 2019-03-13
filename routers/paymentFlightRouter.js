const express = require('express');
const router = express.Router();
const { paymentFlightController } = require('../controllers')

router.post('/paymentgettrans', paymentFlightController.paymentgettrans)
router.post('/editpaymentstatus/:id', paymentFlightController.editpaymentstatus)

router.post('/acceptedmailsend/:id', paymentFlightController.acceptedmailsend)
router.post('/deniedmailsend/:id', paymentFlightController.deniedmailsend)
router.post('/stockupdate/:id', paymentFlightController.stockupdate)

router.post('/countacceptedtrans', paymentFlightController.countacceptedtrans)
router.post('/countdeniedtrans', paymentFlightController.countdeniedtrans)
router.post('/countwaitingtrans', paymentFlightController.countwaitingtrans)
router.post('/countalltrans', paymentFlightController.countalltrans)


module.exports = router;