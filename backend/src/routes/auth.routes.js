const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const {body} = require('express-validator')

const router = express.Router()

router.post('/register', 
[
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').isLength({ min : 6 }).withMessage('Password must be 6 characters long'),
    body('fullName.firstName').notEmpty().withMessage('First Name is required'),
    body('fullName.lastName').notEmpty().withMessage('Last Name is required')
],    
authController.registerUser)

router.post('/login',
[
    body('email').isEmail().withMessage("Invalid Email Format"),
    body('password').notEmpty().withMessage('Password is required')
],
authController.loginUser)

router.post('/logout', authMiddleware.authUser, authController.logoutUser)


module.exports = router