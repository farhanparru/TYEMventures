const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderDetails: {
      posOrderId: Number,
      orderType: String,
      paymentMethod: String,
      paymentTendered: Number,
      orderDate: Date,
      paymentStatus: String,
    },

    products: {
      product_name: String,
      product_quantity: Number,
      product_currency:String,
    },

    customer: {
      name: String,
      phone: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
