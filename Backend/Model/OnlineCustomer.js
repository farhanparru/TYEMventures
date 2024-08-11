const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerDetails: {
    customerName:String,
    phoneNumber: String,
    Location:String,
  },
});

const customerOnline = mongoose.model("OnlineAddcustomer", orderSchema);
module.exports = customerOnline;
