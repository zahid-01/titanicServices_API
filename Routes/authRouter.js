const authRouter = require("express").Router();
const {
  signUp,
  login,
  isLoggedIn,
  logOut,
} = require("../Controller/authController");

authRouter.get("/isLoggedIn", isLoggedIn);
authRouter.get("/logout", logOut);
authRouter.post("/signUp", signUp);
authRouter.post("/login", login);

module.exports = authRouter;
