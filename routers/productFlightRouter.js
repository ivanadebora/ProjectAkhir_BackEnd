const express = require('express');
const router = express.Router();
const { productFlightController } = require('../controllers')


router.get('/listmaskapai', productFlightController.listmaskapai)
router.post('/addmaskapai', productFlightController.addmaskapai)
router.post('/editmaskapai/:id', productFlightController.editmaskapai)
router.post('/deletemaskapai/:id', productFlightController.deletemaskapai)

router.get('/listkota', productFlightController.listkota)
router.get('/listairport', productFlightController.listairport)

router.get('/listproduct', productFlightController.listproduct)
router.post('/addproduct', productFlightController.addproduct)
router.post('/editproduct/:id', productFlightController.editproduct)
router.post('/deleteproduct/:id', productFlightController.deleteproduct)

module.exports = router;