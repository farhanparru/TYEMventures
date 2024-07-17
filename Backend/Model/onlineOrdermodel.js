const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderDetails: {
    posOrderId: Number,
    orderType: String,
    paymentMethod: String,
    paymentTendered: Number,
    orderDate: Date,
  },
  customer: {
    name: String,
    email: String,
    phone: String,
  },
});

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
