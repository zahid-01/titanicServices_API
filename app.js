const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const appError = require("./Utilities/error");
const errorController = require("./Controller/errorController");

const authRouter = require("./Routes/authRouter");
const productRouter = require("./Routes/productRouter");
const orderRouter = require("./Routes/orderRouter");
const userRouter = require("./Routes/userRouter");
const ServerlessHttp = require("serverless-http");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://titanic-frontend-two.vercel.app",
      "https://www.titanicservices.in",
      "https://titanicservices.in",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", authRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/people", userRouter);

app.all("*", (_, __, next) => {
  next(new appError(404, "No page with this URL found on this server"));
});

app.use(errorController);

exports.handler = ServerlessHttp(express);

module.exports = app;
