const { protect, verify } = require("../Controller/authController");
const userRouter = require("express").Router();

const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  addToCart,
} = require("../Controller/userController");

userRouter.use(protect);

userRouter.get("/", getAllUsers);
userRouter.post("/addToCart", addToCart);

module.exports = userRouter;
