const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderDetails: {
    posOrderId: {
      type: Number,
      required: true
    },
    orderType: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentTendered: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    orderDate: {
      type: Date,
      required: true
    },
    products: [
      {
        product_name: {
          type: String,
          required: true
        },
        product_quantity: {
          type: Number,
          required: true
        },
        product_currency: {
          type: String,
          default: 'INR'
        }
      }
    ]
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
