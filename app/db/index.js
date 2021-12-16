const { connect, model } = require("mongoose")
const { user } = require('./schema.js')

connect('mongodb://localhost:27017/User')
    .then((res) => console.log("connectecd"))
    .catch((err) => console.log(err))


const User = model('user', user)



module.exports = {
    User
}
