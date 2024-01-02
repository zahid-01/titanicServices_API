const User = require("../Model/userModel");
const { catchAsync } = require("../Utilities/catchAsync");
const { readOne, updateOne, deleteOne, readAll } = require("./handlerFactory");

exports.getAllUsers = readAll(User);
exports.getUser = readOne(User);
exports.deleteUser = deleteOne(User);
exports.updateUser = updateOne(User);

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, count } = req.body;

  const newCart = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { cart: { item: productId, count } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    newCart,
  });
});
