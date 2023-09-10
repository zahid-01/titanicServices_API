const orderRouter = require("express").Router();

const { protect } = require("../Controller/authController");
const {
  newOrder,
  allOrders,
  myOrders,
  getCheckoutSession,
  callbackUrl,
  uiCallback,
} = require("../Controller/orderController");

orderRouter.post("/callBackUrl/:user/:item", callbackUrl);
orderRouter.post("/uiCallBack", uiCallback);

orderRouter.use(protect);

orderRouter.get("/all/:status", allOrders);
orderRouter.get("/myOrders", myOrders);
orderRouter.get("/get-checkout-session/:id", getCheckoutSession);

module.exports = orderRouter;
