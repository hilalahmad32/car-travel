const groupModel = require("../models/groupModel");
const groupUsersModel = require("../models/groupUsersModel");

function createGroup(reqData) {
  return groupModel.create({
    room: reqData.admin["phone"] + Date.now(),
    admin: reqData.admin,
    image: reqData.image,
    createdAt: Date.now(),
    name: reqData.groupname,
    description: reqData.description,
  });
}

async function createCityGroup(reqData) {
  var data = await groupModel.findOne({ type: "city", room: reqData.room });
  if (!data) {
    return groupModel.create({
      room: reqData.room,
      admin: {
        "name": "CarTravels",
        "city": reqData.city.city_name,
        "state": reqData.city.state_name,
      },
      type: "city",
      image: reqData.image,
      createdAt: Date.now(),
      name: reqData.city.city_name + " City",
      description: `Official ${reqData.city.city_name} city group`,
    });
  } else {
    return data;
  }
}

async function addUser(gId, room, phone, uid) {
  var data = await groupUsersModel.findOne({ room, userPhone: phone });
  if (!data) {
    return groupUsersModel.create({
      groupId: gId,
      room,
      userPhone: phone,
      userUid: uid,
    });
  } else {
    return data;
  }
}
function getRoomUsers(room) {
  // this function doesnt return the users whose registered city is the room
  return groupUsersModel.find({ room });
}

function getGroupDetailsbyRoom(room) {
  return groupModel.findOne({ room });
}

function getUserRooms(user) {
  if (user && user != "") {
    return groupUsersModel.find({ userPhone: user }).populate(
      "groupId",
      "name admin image type",
    );
  } else return [];
}

module.exports = {
  createGroup,
  addUser,
  getGroupDetailsbyRoom,
  getUserRooms,
  getRoomUsers,
  createCityGroup,
};
