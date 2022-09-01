var mongoose = require('mongoose');

const groupModel = new mongoose.Schema({
    room:String,
    admin:Map,
    name:String,
    createdAt:Number,
    description:String,
    image:String,
    secondaryAdmins:[Map],
    type:{
        type:String,
        enum :["city","custom",'broadcast'],
        default:"custom"
    },
    status:{
        type:String,
        enum :["active","inactive","pending"],
        default:"active"
    },
})

module.exports = mongoose.model('groups',groupModel);