const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  success: {
    type: Boolean,
    required: [true, "Provide success info"],
  },
  code: {
    type: String,
    required: [true, "Provide code info"],
  },
  message: {
    type: String,
    required: [true, "Provide message"],
  },
  merchantId: {
    type: String,
    required: [true, "Provide merchantId"],
  },
  merchantTransactionId: {
    type: String,
    required: [true, "Provide merchantTransactionId"],
  },
  transactionId: {
    type: String,
    required: [true, "Provide transactionId"],
  },
  amount: {
    type: String,
    required: [true, "Provide amount"],
  },
  state: {
    type: String,
    required: [true, "Provide state"],
  },
  responseCode: {
    type: String,
    required: [true, "Provide responseCode"],
  },
  type: {
    type: String,
    required: [true, "Provide type"],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "products",
    required: [true, "Provide the product Id"],
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Provide the customer Id"],
  },
});

const Payment = new mongoose.model("payments", paymentSchema);

module.exports = Payment;
