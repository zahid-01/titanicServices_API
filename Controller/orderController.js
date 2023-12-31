const axios = require("axios");
const crypto = require("crypto");

const Orders = require("../Model/orderModel");
const Product = require("../Model/productsModel");
const Payment = require("../Model/paymentModel");

const { catchAsync } = require("../Utilities/catchAsync");

const sendResponse = (res, data, statusCode) => {
  res.status(statusCode).json({
    status: "Success",
    count: data.length,
    data,
  });
};

const newOrder = catchAsync(async (user, item) => {
  const body = {
    product: item,
    customer: user,
  };

  const order = await Orders.create(body);
});

exports.allOrders = catchAsync(async (req, res) => {
  const status = req.params.status;

  const orders = await Orders.find({ status });

  sendResponse(res, orders, 200);
});

exports.myOrders = catchAsync(async (req, res) => {
  const orders = await Orders.find({ customer: req.user.id });

  sendResponse(res, orders, 200);
});

exports.getCheckoutSession = catchAsync(async (req, res) => {
  const { productPrice, _id: productId } = await Product.findById(
    req.params.id
  );
  const { phone, _id: userId } = req.user;

  const payOptions = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: "21456",
    merchantUserId: userId.toString(),
    amount: productPrice * 100,
    redirectUrl: "https://titanicservices.in/myOrders",
    redirectMode: "REDIRECT",
    callbackUrl: `https://titanic-api.onrender.com/orders/callBackUrl/${userId.toString()}/${productId.toString()}`,
    mobileNumber: phone,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const encodedPayload = btoa(JSON.stringify(payOptions));

  const hash = crypto
    .createHash("SHA-256")
    .update(encodedPayload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY)
    .digest("hex");

  const checksumHeader = hash + "###" + process.env.PHONEPE_SALT_INDEX;

  const phonePeRes = await axios({
    method: "POST",
    url: process.env.PHONEPE_PAYMENT_URL,
    data: { request: encodedPayload },
    headers: {
      "X-VERIFY": checksumHeader,
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const { url } = phonePeRes.data.data.instrumentResponse.redirectInfo;

  res.status(200).json({
    status: "Success",
    url,
    data: phonePeRes.data,
  });
});

exports.callbackUrl = catchAsync(async (req, res, next) => {
  const { user, item } = req.params;

  const decodedPayload = JSON.parse(atob(req.body.response));

  const paymentResponse = {
    success: decodedPayload.success,
    code: decodedPayload.code,
    message: decodedPayload.message,
    merchantId: decodedPayload.data.merchantId,
    merchantTransactionId: decodedPayload.data.merchantTransactionId,
    transactionId: decodedPayload.data.transactionId,
    amount: decodedPayload.data.amount,
    state: decodedPayload.data.state,
    responseCode: decodedPayload.data.responseCode,
    type: decodedPayload.data.paymentInstrument.type,
    product: item,
    customer: user,
  };

  await Payment.create(paymentResponse);

  if (decodedPayload.success) {
    newOrder(user, item);
  }

  res.json({ recieved: true });
});

exports.uiCallback = (req, res, next) => {
  res.json({
    data: req.body,
  });
};
