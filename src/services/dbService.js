/* eslint-disable no-undef */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function dbConnect() {
  mongoose.connect(
    "mongodb://chat.cartravels.com:27017/Travchat?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  ).then(() => console.log("Connection successfully")).catch((err) =>
    console.log(err)
  );
}
const sqlOptions = {
  client: "mysql",
  connection: {
    host: "127.0.0.1", //process.env.SQL_HOST,
    password: "Dbungster1",
    user: "admin",
    database: "soungster",
  },
};
module.exports = { dbConnect, sqlOptions };
