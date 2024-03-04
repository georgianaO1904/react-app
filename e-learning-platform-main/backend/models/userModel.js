const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    Teacher:{
        type : Boolean,
        required : true,
        default : false
    },
    avatar: {
        type: String,
        default: "https://i.imgur.com/tJOSejv.png"
    }, 
    description:{
        type : String
    },
    headline: {
        type : String
    },
    roles: [ {type: String} ]
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)