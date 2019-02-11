const express = require('express');
const router = express.Router();
const { flightController } = require('../controllers');


router.get('/listmaskapai', flightController.listmaskapai)
router.post('/addmaskapai', flightController.addmaskapai)
router.post('/editmaskapai/:id', flightController.editmaskapai)
router.post('/deletemaskapai/:id', flightController.deletemaskapai)

router.get('/listproduct', flightController.listproduct)
router.post('/addproduct', flightController.addproduct)
router.post('/editproduct/:id', flightController.editproduct)
router.post('/deleteproduct/:id', flightController.deleteproduct)

module.exports = router;