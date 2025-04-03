const express = require('express')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/create-user', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name,email and password are required" })
        }
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        //hashing user password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newData = await userModel.create({ name: name, email: email, password: hashedPassword })
        //create token
        const token = jwt.sign({ id: newData._id }, process.env.JWT_SECRET);
        // res.json({ success: true, token });

        return res.status(201).json({
            success: true,
            token,
            user: newData,
        });

    } catch (error) {
        res.status(400).json(error)
    }
})



router.get('/get-user',async(req,res)=>{
    try {
        const user = await userModel.find()
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
    }
})





//api for using login

router.post('/login-user', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        console.log(user);

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true,data:{
                token,
                email,
                id:user.id
            }  }).status(200);
          } else {
            res.json({ success: false, message: "Invalid credentials" });
          }
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router