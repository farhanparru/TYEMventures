const mongoose = require("mongoose");

const salesData = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "COMPLETED"],
  },
  orderDetails: {
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
  },
  location: {
    type: String,
    required: true,
  },
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
  createdDate: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: ["SALE", "PURCHASE"],
  },
  actions: {
    type: [String],
  },
});

const salesOrder = mongoose.model("Sales", salesData);
module.exports = salesOrder;
