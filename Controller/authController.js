const jwt = require("jsonwebtoken");

const User = require("../Model/userModel");
const { catchAsync } = require("../Utilities/catchAsync");
const AppError = require("../Utilities/error");

const sendAuthResponse = (res, user, message, token = null) => {
  const userData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    id: user._id,
  };

  res.status(200).json({
    status: "Success",
    message,
    userData,
    token,
  });
};

const createSendToken = ({ _id }, res, req) => {
  const cookie = jwt.sign({ data: _id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    sameSite: "none",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    // secure: true,
  };

  res.cookie("JWT", cookie, cookieOptions);
  return cookie;
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
  };
  const user = await User.create(newUser);

  const token = createSendToken(user, res, req);

  sendAuthResponse(res, user, "Account created successfully", token);
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError(400, "Enter email and password"));

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError(203, "No user with that email found"));
  }

  const match = await user.checkPassword(password, user.password);

  if (!match) return next(new AppError(203, "Invalid credentials"));

  const token = createSendToken(user, res, req);

  sendAuthResponse(res, user, "Logged In successfully", token);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (req.headers.cookie) {
    token = req.cookies.JWT;
  }

  if (!token) return next(new AppError(404, "Not Logged in"));

  const { data } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(data);

  if (!user) return next(new AppError(404, "User does not exists"));

  req.user = user;

  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies) {
    token = req.cookies.JWT;
  }

  const { data } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(data);

  sendAuthResponse(res, user, "Logged In successfully");
});

exports.logOut = catchAsync(async (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    sameSite: "none",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    secure: true,
  };

  res.cookie("JWT", "expire", cookieOptions);

  res.status(200).json({
    status: "Success",
    message: "Logged out successfully",
  });
});

exports.verify = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError(400, "Not authorized"));
    next();
  };
};
