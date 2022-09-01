const chatModel = require('../models/chatModel');

//add pagination for messages
function getChatByRoom(room)
{
    return chatModel.find({'room':room}).sort({'time':-1}).limit(200);
}

//add user the group room when user sent message in that group
function getLatestChatsByUser(user,rooms=[])
{
    
    if(user&&user!="")
    {
        return chatModel.find({$or: [{'room':{ $regex: user }},{'room':{$in:rooms}}]}).lean().sort({'time':-1});
    }else return [];
   
}
function delChatMessage(data)
    {
        try{
            chatModel.findOneAndDelete(data).then((rdata)=>{console.log('delteled')}).catch(e=>console.error(e));
        }
        catch(e)
        {
            console.error(e);
        }
    }
function newChatMessage(data)
{
    try{
        chatModel.create(data).then((rdata)=>{console.log('nm')}).catch(e=>console.error(e));
    }
    catch(e)
    {
        console.error(e);
    }
}
function changeReadStatus(id)
{
 return chatModel.findByIdAndUpdate(id,{$set:{readStaus:2}});
}
function allReadinRoom(room,user)
{
    chatModel.find({room: room,readStatus:{$ne:2}}).lean().then((data)=>
{
    if(data)
    {
        data.forEach((ele)=>{
            if(ele.receiver.phone==user)
            { 
                chatModel.updateOne({'_id':ele._id},{$set:{'readStatus':2}}).then(console.log).catch(console.log);
            }
        })
    }

}).catch((e)=>console.error(e));
}
module.exports = {getChatByRoom,getLatestChatsByUser,newChatMessage,changeReadStatus,allReadinRoom,delChatMessage};