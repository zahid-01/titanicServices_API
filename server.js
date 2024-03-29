const app = require("./app");
const config = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful"))
  .catch((e) => console.log("DB connection failed"));

app.listen(process.env.PORT, () => {
  console.log("App running");
});
