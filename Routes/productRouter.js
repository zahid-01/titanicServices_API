const productRouter = require("express").Router();

const { protect, verify } = require("../Controller/authController");

const {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getAllProducts,
  uploadPhoto,
  resizePhoto,
} = require("../Controller/productController");

productRouter.get("/", getAllProducts);
productRouter.route("/:id").get(getProduct);

productRouter.use(protect, verify("ns-admin"));
productRouter
  .route("/:id")
  .patch(uploadPhoto, resizePhoto, updateProduct)
  .delete(deleteProduct);

productRouter.post("/add", uploadPhoto, resizePhoto, addProduct);

module.exports = productRouter;
