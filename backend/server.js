require('dotenv').config()

const http = require('http')

const app = require('./src/app')
const connectDB = require('./src/db/db')

const setUpSocketServer = require('./src/socket/socket.server')

const httpServer = http.createServer(app)

setUpSocketServer(httpServer)

connectDB()


httpServer.listen(3000, () => {
    console.log("Server runing on port 3000")
})
