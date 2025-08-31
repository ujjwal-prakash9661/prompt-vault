const mongoose = require('mongoose')

function connectDB()
{
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connect to DB")
    })

    .catch(err => {
        console.log("Server encountered an error", err)
    })
}

module.exports = connectDB