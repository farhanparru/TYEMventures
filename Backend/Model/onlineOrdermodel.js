const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderDetails: [
      {
        product_name: String,
        product_quantity: Number,
        product_currency: String,
      }
    ],
    orderMeta: {
      posOrderId: Number,
      orderType: String,
      paymentMethod: String,
      paymentTendered: Number,
      orderDate: String,
      paymentStatus: String,
    },
    customer: {
      name: String,
      phone: String,
    },
    receivedAt: { type: Date, default: Date.now } // Automatically set to the current date and time
  },
  { timestamps: true }
);

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
