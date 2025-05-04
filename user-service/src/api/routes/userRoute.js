const express = require("express");
const {addPhoneNumber,addUserAddress,sendUser} = require("../controllers/userController");
const {requireAuth} = require("../middleware/requireAuth");
const rateLimit = require('express-rate-limit');
const userRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

userRouter.use(requireAuth);

userRouter.patch("/add-phone-number",limiter,addPhoneNumber);
userRouter.patch("/add-address",limiter,addUserAddress);
userRouter.get("/get-user/:id",sendUser);
userRouter.all('*', (req, res) => {
    res.status(405).json({ 
        message: 'Method not allowed' 
    });
});
module.exports = {
    userRouter
}