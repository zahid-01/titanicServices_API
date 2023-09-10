const { protect, verify } = require("../Controller/authController");
const userRouter = require("express").Router();

const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../Controller/userController");

userRouter.use(protect);

userRouter.get("/", getAllUsers);

module.exports = userRouter;
