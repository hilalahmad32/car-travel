var mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  uid: String,
  token: String,
  cid: String,
  cartravelsId: String,
  lat: Number,
  long: Number,
  time: Number,
  phone: String,
});

module.exports = mongoose.model("user", userModel);
