const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validationResult} = require('express-validator')

async function registerUser(req, res)
{
    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {email, password, fullName:{firstName, lastName} } = req.body

    const isUserAlreadyExist = await userModel.findOne({email})

    if(isUserAlreadyExist)
    {
        return res.status(400).json({
            message : "User already exist"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullName : {
            firstName, lastName
        },

        email,

        password : hashPassword
    })

    const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(201).json({
        message : "User created Successfully",

        user : {
            email : user.email,
            _id : user._id,
            fullName : user.fullName
        },
        token
    })
}

async function loginUser(req, res)
{
    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors : errors.array() })
    }
    
    const {email, password} = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user)
    {
        return res.status(400).json({
            message : "Invalid user or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid)
    {
        return res.status(400).json({
            message : "Invalid Password"
        })
    }

    const token = jwt.sign({id : user._id}, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(200).json({
        message : "User logged in successfully",

        user : {
            email : user.email,
            _id : user._id,
            fullName : user.fullName
        },
        token
    })
}

async function logoutUser(req, res) 
{
    res.clearCookie('token')    
    res.status(200).json({
        message : "Logout Successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}