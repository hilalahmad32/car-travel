var mongoose = require('mongoose');

const groupUsersModel = new mongoose.Schema({
    groupId:{ type: mongoose.Schema.Types.ObjectId, ref: "groups" },
    room:String,
    userPhone:String,
    userUid:String,//for notifications
})

module.exports = mongoose.model('groupusers',groupUsersModel);