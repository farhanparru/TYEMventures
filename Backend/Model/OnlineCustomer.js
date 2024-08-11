const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {

   customerDetails:{
     Location:String,
   }

  })

const Order = mongoose.model("OnlineAddcustomer", orderSchema);
module.exports = Order;
