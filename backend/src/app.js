const express = require('express')
const cookieparser = require('cookie-parser')

const authRoutes = require('./routes/auth.routes')
const promptRoutes = require('./routes/prompt.routes')

const userRoutes = require('./routes/user.routes')
const path = require("path");

const helmet = require('helmet')
const cors = require('cors')


const app = express()


app.use(helmet())

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth',authRoutes)
app.use('/api/prompts', promptRoutes)

app.use('/api/user', userRoutes)

app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app