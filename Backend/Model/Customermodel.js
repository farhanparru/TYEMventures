const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    TaxNo: {
      type: Number,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    messageSent:{
     type:Boolean,
      default:false
    }
  },
  
  { timestamps: true }
); // Add this line to enable timestamps

const Customers = mongoose.model("customer", customerSchema);
module.exports = Customers;
