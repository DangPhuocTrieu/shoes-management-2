import express from 'express'
import argon2 from 'argon2'
import User from '../models/User.js'

const router = express.Router()

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const validUsername = await User.findOne({ username: req.body.username })

        if (validUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists.'
            })
        }
        
        const newUser = new User(req.body)
        const savedUser = await newUser.save()

        res.status(200).json({
            success: true, 
            message: 'Sign up successfully', 
            data: savedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        if (!user) {
            return res.status(403).json({
                success: false, 
                message: 'Incorrect username', 
            })
        }

        const passwordValid = user.password === req.body.password

        if (!passwordValid)(
            res.status(403).json({
                success: false, 
                message: 'Incorrect password', 
            })
        )
        else {
            res.status(200).json({ 
                success: true, 
                message: 'Login successfully!', 
                data: user
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


export default router