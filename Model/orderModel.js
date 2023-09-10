const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
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
  quantity: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["ordered", "dispatched", "delivered"],
    default: "ordered",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

ordersSchema.pre(/^find/, function (next) {
  this.find()
    .populate({
      path: "product",
    })
    .populate({ path: "customer" });
  next();
});

const Orders = new mongoose.model("orders", ordersSchema);
module.exports = Orders;
