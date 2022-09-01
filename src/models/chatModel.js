var mongoose = require('mongoose');

const chatModel = new mongoose.Schema({
    room:String,
    // roomType:{
    //     type:String,
    //     enum :["group","single"],
    //     default:"single"
    // },
    sender:Map,
    time:Number,
    text:String,
    msgType:{
        type:String,
        enum :["text","image","post","form","file","audio"],
        default:"text"
    },
    attachment:Map,
    formData:Map,
    receiver:Map,
    readStatus:{type:Number,default:0},
    status:{
        type:String,
        enum :["active","inactive","admin","pending"],
        default:"active"
    },
})

module.exports = mongoose.model('chat',chatModel);