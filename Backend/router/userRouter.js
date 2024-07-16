const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')


router

.post('/orders',userCtrl.submitOrder)

     
module.exports = router        