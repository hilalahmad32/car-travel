const express = require("express");

const dotenv = require("dotenv");

const socketIO = require("socket.io");
const socketService = require("./src/services/socket");
const app = express();
const cors = require("cors");
var multer = require("multer");
const chatRouter = require("./src/routes/chatRouter");
const { errorHandler } = require("./src/middlewares/error");
const redisAdapter = require("socket.io-redis");

app.use(cors());

dotenv.config();

const authenticateReq = require("./src/middlewares/auth");

const { dbConnect } = require("./src/services/dbService");
const { Users } = require("./src/utils/users");
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use([
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  authenticateReq,
]);

//* Manage a table for users, their registered city and notification tokens
// * Sync the table whenever user opens the app

// ? SQL db for chat and users

app.get("/", (req, res) => {
  res.send({ "message": "Hello world" });
});

app.post("/dummy", (req, res) => {
  console.log(req.body);
  console.log("a bg message");
  res.send({ "message": "Hello world" });
});

app.use("/chat", chatRouter);

app.use(function (req, res, next) {
  console.log(req.url);
  var err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

var server = app.listen(process.env.PORT, () => {
  dbConnect();
  console.log("server started");
});

let io = socketIO(server);
try {
  io.adapter(redisAdapter({ host: "localhost", port: 6379 }));
} catch (e) {
  console.log(e);
}

io.on("connection", (socket) => {
  socketService(io, socket);
});
