const mongoose = require("mongoose");

const POSORDER = new mongoose.Schema({
  itemDetails: {
    items: {
      type: Number,
      required: true,
    },
    itemName: {
      type: [String],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ["cash", "card", "Split", "Talabat", "other"],
    },
    total: {
      type: Number,
      required: true,
    },
  },
  orderDetails: {
    paymentStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETED"],
    },
    orderNumber: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    orderDate: {
     orderDate: Date, // Store date as UTC
    },
  },
  discount: {
    type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
});

const salesOrder = mongoose.model("POSORDER", POSORDER);
module.exports = salesOrder;
