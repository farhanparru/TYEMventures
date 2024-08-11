const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')




router.post('/orders', userCtrl.submitOrder);
router.post('/WhatsappOrder', userCtrl.onlineOrder);
router.get('/Whatsappget', userCtrl.fetchOnlineOrder)
router.get('/getOrders', userCtrl.getOrders);
router.post('/createCategory', userCtrl.category)
router.get('/getCategory', userCtrl.getCategory)
router.post('/Expense', userCtrl.expense)
router.post('/addCustomer', userCtrl.addCustomer)
router.put('/orders/:id/status',userCtrl.statusUpdate)
router.post('/printreceipt', userCtrl.handleReciptprinter)
router.patch('/Googlesheet',userCtrl.ItemsUpdate)
router.post('/Onlinecustomer',userCtrl.onlineCustomer)
router.patch('/PaymentStatus/:id', userCtrl.paymentStatus);


     
module.exports = router        