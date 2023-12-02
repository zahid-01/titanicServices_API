const mongoose = require("mongoose");

const ProductsSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Provide a product name"],
  },
  productDescription: {
    type: String,
    required: [true, "Provide a product description"],
  },
  productPrice: {
    type: Number,
    required: [true, "Provide a product price"],
  },
  productCode: {
    required: [true, "Provide a product code"],
    type: String,
    unique: [true, "Product exists"],
  },
  productCategory: {
    type: String,
  },
  productBrand: {
    type: String,
  },
  images: {
    type: [String],
    default: "default.jpg",
  },
});

// ProductsSchema.pre("save", function () {
//   const id = this._id.toHexString();
//   let images = [];
//   this.images.forEach((el) => {
//     let img = el.split("-")[1];
//     images.push(`${id}-${img}`);
//   });
//   this.images = images;
// });

// ProductsSchema.pre(/^find/, function () {
//   console.log(this);
// });

const Product = new mongoose.model("products", ProductsSchema);
module.exports = Product;
