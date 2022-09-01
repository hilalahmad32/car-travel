var FCM = require('fcm-node');
const axios = require('axios');
var serverKey = 'AAAA0CV4BVA:APA91bFZDhA8uZEbNDaDSkO87Jz2uZAA_EhaKw9oI9_8t4irZ5BE6jAtgl9muJLVETzVjpZ9VyGmhMsA3dQJx_Idn2yUXPNCtSptim6jUcgvRiJIzCYLShlMIhRwWL05L2nnU-LY55g6'; //put your server key here
var fcm = new FCM(serverKey);

module.exports = async function sendNotification(data)
{
    fetchUserFcmToken(data.receiver.uid).then((tokenData)=>{
        if(tokenData.error=="true")
        {
            console.log(tokenData);
            return;
        }
            
        var message = { 
            //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: tokenData['token'], 
            collapse_key: 'your_collapse_key',
            notification: {
                title: `${data.sender.name}`, 
                body: data.message
            },
            data: {  //you can send only notification or only data(or include both)
                "sender":data.sender.phone,
                "sender_image":data.sender.image,
                "sender_uid":data.sender.uid,
                "isGroup":data.sender.isGroup,
                "sender_name":data.sender.name,
                "type":'chat'
            }
        };
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong! ",err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    })
}

async function fetchUserFcmToken(uid)
{
    try{
    var res = await axios
    .get("https://cartravels.com/web_api/api/Chat/getUserToken", {
        params:{
            uniid:uid
        }
    });
    return res.data;
    }
    catch(error){
      console.error(error)
    }
}