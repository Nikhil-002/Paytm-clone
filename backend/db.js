const mongoose = require('mongoose')

const MONGO_URI = 'mongodb+srv://admin:P7eFa52WEyXJYI70@cluster0.2jxd9ic.mongodb.net/paytm'

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const userSchema = mongoose.Schema({
    username : String, 
    password : String,
    firstName : String,
    lastName : String,
})

const accountSchema = mongoose.Schema({
    balance : Number,
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {User,Account};