const router = require("express").Router();
const { Users } = require("../utils/users");
var multer = require("multer");
const chatController = require("../controllers/chatController");
const groupController = require("../controllers/groupController");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/roomChat", async (req, res, next) => {
  if (req.query.room == undefined) {
    var err = new Error("missing values");
    err.statusCode = 400;
    next(err);
  } else {
    // TODO group details fetch
    // var group = await groupController.getGroupDetailsbyRoom(data.room);

    chatController.getChatByRoom(req.query.room).then((data) => {
      res.send({ error: false, chats: data });
    }).catch((e) => {
      next(e);
    });
  }
});

router.post("/upload", upload.single("file"), function (req, res, next) {
  if (req.file) {
    const url = "https://chat.cartravels.com/uploads/" + req.file.filename;

    return res.send({
      success: true,
      data: url,
      message: "Upload successfull",
    });
  } else {
    next(Error("File missing"));
  }
});

router.post("/sendJoiningNotification", (req, res, next) => {
  if (req.body.user == undefined || req.body.user == "") {
    let err = new Error("missing user");
    err.statusCode = 400;
    next(err);
  } else {
    res.send({
      user: req.body.user,
    });
  }
});
router.get("/citygroupdetails", (req, res, next) => {
  groupController.getGroupDetailsbyRoom(req.query.room).then((data) => {
    res.send({ error: false, data: data });
  });
});
router.post("/createcitygroup", (req, res, next) => {
  groupController.createCityGroup(req.body).then((data) => {
    groupController.addUser(
      data._id,
      data.room,
      req.body.user.phone,
      req.body.user.uid,
    ).catch(console.log);
    res.send({ error: false, data });
  });
});

router.post("/creategroup", (req, res, next) => {
  groupController.createGroup(req.body).then((data) => {
    groupController.addUser(
      data._id,
      data.room,
      req.body.admin.phone,
      req.body.admin.uid,
    ).catch(console.log);
    // req.body.contacts.forEach((e) => {
    //   groupController.addUser(data._id, data.room, e.phone, e.uid).catch(
    //     console.log,
    //   );
    // });
    res.send({ error: false, data });
  });
});

router.get("/chatHome", (req, res, next) => {
  if (req.query.user == undefined || req.query.user == "") {
    var err = new Error("missing values for chat home");
    err.statusCode = 400;
    next(err);
  } else {
    req.query.image =
      "https://play-lh.googleusercontent.com/ha3sgGB97PZgAPez1VAV8qQYuNDslIQUPfSAeZXBuSrZMjGw140DRGizreqMO45tEwU=s180-rw";
    groupController.createCityGroup(req.query).then((data) => {
      groupController.addUser(
        data._id,
        data.room,
        req.query.user,
        req.query.uid,
      ).catch(console.log);
    });
    groupController.getUserRooms(req.query.user).then((groupData) => {
      var rooms = [req.query.regRoom];
      groupData.forEach((e) => rooms.push(e.room));

      chatController.getLatestChatsByUser(req.query.user, rooms).then(
        (data) => {
          var result = [];
          data.forEach((ele) => {
            var grpIndex = groupData.findIndex((e) => e.room == ele.room);
            var t = {
              isGroup: grpIndex != -1,
              message: ele,
              unreadCount: ele.readStatus == 2 ? 0 : 1,
            };
            if (t.isGroup && groupData[grpIndex] != null) {
              t.displayName = groupData[grpIndex].groupId.name;
              t.displayImage = groupData[grpIndex].groupId.image;
              t.groupType = groupData[grpIndex].groupId.type;
            }
            var ind = result.findIndex((rData) =>
              rData.message.room == ele.room
            );
            if (ind == -1) {
              result.push(t);
            } else {
              // exclude sender messages readStatus
              result[ind].unreadCount += ele.readStatus == 2 ? 0 : 1;
            }
          });
          res.send({ error: false, chats: result });
        },
      );
    })
      .catch((e) => {
        console.error(e);
        next(e);
      });
  }
});

module.exports = router;
