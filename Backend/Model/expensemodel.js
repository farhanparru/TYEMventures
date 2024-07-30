const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  Amount: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

const Expense = mongoose.model("Allexpense", ExpenseSchema);
module.exports = Expense;
