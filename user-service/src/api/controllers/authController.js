const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {JWTSECRET} = require("../config/config");

const createToken = (_id) => {
    return jwt.sign({_id}, JWTSECRET, {expiresIn: "60d"});
}

const signUpHandler = async (req,res) => {
    const {firstName,lastName,username,email,password} = req.body;

    try {
        if(!firstName || !lastName || !username || !email || !password){
            return res.status(400).json({
                message : "Missing Fields"
            })
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                message : "Email is invalid"
            })
        }

        const [existingEmail,existingUsername] = await Promise.all([
            User.findOne({email}),
            User.findOne({username})
        ]);

        if(existingEmail){
            return res.status(409).json({
                message : "Email in use."
            })
        }

        if(existingUsername){
            return res.status(409).json({
                message : "Username already taken."
            })
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({
                message : "Weak password"
            })
        }

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
        })
        
        await newUser.save();

        const token = createToken(newUser._id);

        return res.status(201).json({
            message : "User Registration is successfull.",
            token,
            username : newUser.username
        });
        
    } catch (error) {
        console.log(error);

        if(error.name === "ValidationError"){
            const errors = {};

            for(const field in error.errors){
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                message : errors
            })
        }

        return res.status(500).json({
            message: "An error occurred on server. Please try again later",
        });
    }
}

const signInHandler = async (req,res) => {
    const {email,password} = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({
                message : "Missing Fields"
            })
        }

        const user = await User.findOne({email}).select("password lastLogin");

        if(!user){
            return res.status(401).json({
                message : `Invalid credentials.`
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            return res.status(401).json({
                message : "Invalid credentials."
            })
        }

        user.lastLogin = new Date();
        await user.save();

        const token = createToken(user._id);

        return res.status(200).json({
            token,
            username : user.username
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message : "An error occurred on server. Please try again later."
        })
    }
}

module.exports = {
    signInHandler,
    signUpHandler
}