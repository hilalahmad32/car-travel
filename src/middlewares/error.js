const mongoose = require('mongoose');
const httpStatus = require('http-status');

function errorHandler(error, req, res, next) {
  var statusCode ;
  if(error.statusCode)
  {
    statusCode = error.statusCode;
  }
  else{
    statusCode = error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
  }
  const message = error instanceof mongoose.Error ? httpStatus[statusCode]:error.message ;
  console.log({success:false,message});
  if (error.name === 'MongoError' && error.code === 11000) {
    //duplicate key error
    var errorItems = error.message.split(' ');
    var ind = errorItems.indexOf('index:');
    var key = errorItems[ind+1];
    res.status(statusCode).send({status:false,message:`${key} already exists`});
  }
 else
 {
  res.status(statusCode).send({status:false,message});
 }
 next();
}

module.exports = {
  errorHandler,
};
