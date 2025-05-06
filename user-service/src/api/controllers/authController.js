const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {config} = require("../config/config");
const path = require("path");
const fs = require("fs");
//const jose = require("jose");


const createToken = (userId,role) => {
    return jwt.sign(
        { userId, role , sub: userId},            
        config.JWT_PRIVATE_KEY,                 
        {
          algorithm: 'RS256',
          issuer: 'http://localhost:3001/user-service',
          audience: 'internal-services',
          expiresIn: '7d'
        }
    );
}

const signUpHandler = async (req,res) => {
    const {firstName,lastName,username,email,password,role} = req.body;

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
            User.findOne({email : email}),
            User.findOne({username : username})
        ]);
        //console.log(existingEmail);
        //console.log(existingUsername);
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
            role : role
        })
        
        await newUser.save();

        const token = createToken(newUser._id,newUser.role);

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

/*
const getJWKS = async (req, res) => {
    try {
      const keyStore = jose.JWK.createKeyStore();
      const key = await keyStore.add(JWT_PUBLIC_KEY, 'pem');
      return res.json({ keys: [key.toJSON()] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};
*/

const sendPublicKey = (req, res) => {
    const publicKeyPath = path.join(__dirname, '../secrets/public.pem');
    console.log('Resolved public key path:', publicKeyPath);
    let publicKey
    try {
      publicKey = fs.readFileSync(
         publicKeyPath,
        'utf8'
      );
      console.log("Public key loaded successfully")
      return res.json({ publicKey });
    } catch (err) {
      console.log("Failed to load public key: ", err.message);
      return res.status(500).json({ message: "Failed to load public key" });
    }
};
module.exports = {
    signInHandler,
    signUpHandler,
    sendPublicKey
}