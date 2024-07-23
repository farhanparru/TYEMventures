const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')




router.post('/orders', userCtrl.submitOrder);
router.post('/WhatsappOrder', userCtrl.onlineOrder);
router.get('/getOrders', userCtrl.getOrders);


     
module.exports = router        