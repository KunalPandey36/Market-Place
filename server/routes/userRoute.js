const router = require('express').Router();
const User = require('../models/usermodel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');

// new user registration
router.post("/register", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // Checking the user exist or not
        if (user) {
            throw new Error("User Already Exist");
        }
        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        //Creating new user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "User Created Succesfully"
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
//user login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // Checking if user does not exist
        if (!user) {
            throw new Error("User does not exist");
        }
        //Compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            throw new Error("Invalid Password");
        }
        // create and assign token

        const token = jwt.sign({userId: user._id},process.env.jwt_secret, {expiresIn:"1d"});

        // send repsonse
        res.send({
            success: true,
            message: "User Logged in Succesfully",
            data: token
        })


    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

// get current user

router.get("/get-current-user", authMiddleware, async(req,res)=>{
    try{
        const user = await User.findById(req.body.userId);
        res.send({
            success : true,
            message : "User fetched Succesfully",
            data: user,
        });

    }catch(error){
        res.send({
            success : false,
            message : error.message,
        })
    }
})

module.exports = router;