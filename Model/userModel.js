const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter a valid name"],
  },
  email: {
    type: String,
    required: [true, "Enter a valid email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: [true, "Email already exist"],
  },
  password: {
    type: String,
    required: [true, "Enter a valid name"],
    select: false,
  },
  phone: {
    type: Number,
    validate: {
      validator: function (props) {
        const phoneLen = props.toString().length;
        return phoneLen === 10;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Enter a valid phone"],
  },
  address: {
    type: [String],
    required: [true, "Enter a valid address"],
  },
  role: {
    type: String,
    enum: ["ns-admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.checkPassword = async function (enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, password);
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
