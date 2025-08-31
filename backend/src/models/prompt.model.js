const mongoose = require('mongoose')

const promptSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },

    content : {
        type : String,
        required : true
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },

    category: { 
        type: String, 
        default: 'General' 
    },

    tags : {
        type : [String],
        default : []
    },

    favouritedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
}, 
    {
        timestamps : true
    }
)

const promptModel = mongoose.model('prompt',promptSchema)

module.exports = promptModel