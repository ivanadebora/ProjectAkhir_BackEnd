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

router.post('/listsearch', flightController.listsearch)
router.post('/getdetail', flightController.getdetail)
router.post('/isicart', flightController.isicart)
router.post('/lihatcart', flightController.lihatcart)
router.post('/lihatcartdetail', flightController.lihatcartdetail)
router.post('/addpassenger', flightController.addpassenger)
router.post('/listpassenger', flightController.listpassenger)


module.exports = router;