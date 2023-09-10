const User = require("../Model/userModel");
const { readOne, updateOne, deleteOne, readAll } = require("./handlerFactory");

exports.getAllUsers = readAll(User);
exports.getUser = readOne(User);
exports.deleteUser = deleteOne(User);
exports.updateUser = updateOne(User);
