const {sign,verify} = require('jsonwebtoken');
let JWTkey='' // key to gen tok
async function forMail(data) {
    return sign({data},JWTkey,{ expiresIn:'5h' })
}

async function toMail(EmailID){
  try{
    return[true,verify(EmailID,JWTkey)]
  }catch(err){
    console.log(err)
    return[false]
  }
}

async function createLog(data) {
    return sign({data},JWTkey,{ expiresIn:'5h' })
}


async function forLog(data){
  try{
    return[true,verify(data,JWTkey)]
  }catch(err){
    console.log(err)
    return[false]
  }
}



module.exports = {
  forMail,
  toMail,
  createLog,
  forLog
}
