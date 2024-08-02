const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderDetails: {
    posOrderId: Number,
    orderType: String,
    paymentMethod: String,
    paymentTendered: Number,
    orderDate:Date,
    product_name: String,
    product_quantity: Number,
    paymentStatus:String,
  },
                               

  customer: {
    name: String,
    email: String,
    phone: String,
  },
  
},{timestamps: true});

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
