const express = require("express");
const {signInHandler,signUpHandler} = require("../controllers/authController");
const rateLimit = require('express-rate-limit');
const { requireAuth } = require("../middleware/requireAuth");
const authRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

//authRouter.use(limiter);
authRouter.post("/signup",signUpHandler);
authRouter.post("/signin",signInHandler);
authRouter.get("/get-auth/:id",requireAuth);
//authRouter.get("/get-public-key",getJWKS);



module.exports = {
    authRouter,
}