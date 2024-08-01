const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderDetails: {
    posOrderId: Number,
    orderType: String,
    paymentMethod: String,
    paymentTendered: Number,
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'], // Define the possible payment statuses
      default: 'Pending', // Set a default value
    },
    orderDate: Date,
    products: [
      {
        product_name: String,
        product_quantity: Number,
        product_currency: {
          type: String, // Currency code (e.g., 'INR')
          default: 'INR', // Default value
        },
      },
    ],
  },
  customer: {
    name: String,
    email: String,
    phone: String,
  },
},{timestamps: true});

const Order = mongoose.model("OnlineOrder", orderSchema);
module.exports = Order;
