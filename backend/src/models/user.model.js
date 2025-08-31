const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase : true
    },
    
    fullName : {
        firstName : {
            type : String,
            required : true
        },

        lastName : {
            type : String,
            required : true
        }
    },

    password : {
        type : String,
        required : true
    },

    favourites : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'prompt'
    }],

    promptCount : {
        type : Number,
        default : 0
    }
    
},  {
        timestamps : true
    }
)

const userModel = mongoose.model('user', userSchema)

module.exports = userModel