const express = require('express');
const router = express.Router();
const { flightController } = require('../controllers');


router.post('/listsearch', flightController.listsearch)
router.get('/listkota', flightController.listkota)
router.get('/listmaskapai', flightController.listmaskapai)
router.post('/getdetail', flightController.getdetail)

router.post('/listsearchmaxprice', flightController.listsearchmaxprice)
router.post('/listsearchminprice', flightController.listsearchminprice)
router.post('/listsearchtimeawal', flightController.listsearchtimeawal)
router.post('/listsearchtimeakhir', flightController.listsearchtimeakhir)

router.post('/isicart', flightController.isicart)
router.post('/lihatcart', flightController.lihatcart)
router.post('/lihatcartdetail', flightController.lihatcartdetail)
router.post('/deletecart', flightController.deletecart)

router.post('/addpassenger', flightController.addpassenger)
router.post('/listpassengercart', flightController.listpassengercart)
router.post('/listpassengerhistory', flightController.listpassengerhistory)
router.post('/updatepassenger', flightController.updatepassenger)

router.post('/addtransaction', flightController.addtransaction)
router.post('/lihathistory', flightController.listhistory)
router.post('/listhistorydetail', flightController.listhistorydetail)


module.exports = router;