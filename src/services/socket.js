const { Users } = require("../utils/users");
const chatController = require("../controllers/chatController");
const groupController = require("../controllers/groupController");
const ChatUsers = new Users();
const sendNotification = require("./notificationService");
const redis = require("redis");
const client = redis.createClient();

module.exports = (io, socket) => {
  socket.on("joinServer", async (params) => {
    try {
      if (params.user) {
        await ChatUsers.addUser(socket.id, params.user, "");
        io.emit("usersList", await ChatUsers.getAllUserList());
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("newChat", async (params) => {
    try {
      if (params.user) {
        var room = params.room;
        socket.join(room);
        chatController.allReadinRoom(room, params.user);
        await ChatUsers.updateUserRoom(socket.id, params.user, room);
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("deleteMessage", async (data) => {
    let otherUser = await ChatUsers.getUser(data["del"].receiver.phone);
    if (otherUser && otherUser.status == 1) { //other user connected to socket server
      if (otherUser.room != "" && otherUser.room == data.room) {
        console.log("senging to room");
        socket.to(data.room).emit("delMessage", data["del"]);
      } else {
        console.log("sengind user");
        socket.to(otherUser.id).emit("updateLatest", data["update"]);
      }
    }
    chatController.delChatMessage(data["del"]);
  });

  socket.on("createMessage", async (data) => {
    var newMessage = data;
    socket.to(data.room).emit("newMessage", data);
    var group = await groupController.getGroupDetailsbyRoom(data.room);
    if (group) {
      //getRoomUsers gives all the users in that room including the
      //registered people in that group who has fetched the chatHome data atleast once
      // so we need not check for city groups
      groupController.getRoomUsers(data.room).then((users) => {
        console.log(users);
        users.forEach(async (el) => {
          if (el.userPhone != data.sender.phone) {
            let user = await ChatUsers.getUser(el.userPhone);
            if (user && user.status == 1) {
              socket.to(user.id).emit("updateLatest", data);
            } else {
              data.receiver.uid = el.userUid;
              sendNotification(data);
            }
          }
        });
      });
    } else {
      let otherUser = await ChatUsers.getUser(data.receiver.phone);
      if (otherUser && otherUser.status == 1) { //other user connected to socket server
        if (otherUser.room != "" && otherUser.room == data.room) {
          console.log("sengind to room");
          newMessage.readStatus = 2;
        }
        console.log("senging user");
        socket.to(otherUser.id).emit("updateLatest", data);
        newMessage.readStatus = 1;
      } else {
        console.log("notification");
        sendNotification(data);
      }
    }
    chatController.newChatMessage(newMessage);
  });

  socket.on("exitRoom", async (params) => {
    await ChatUsers.updateUserRoom(socket.id, params.phone, "");
    socket.leave(params.room);
  });

  socket.on("disconnect", async () => {
    await ChatUsers.setOffline(socket.id);
    io.emit("usersList", await ChatUsers.getAllUserList());
  });
};
