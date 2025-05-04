const express = require("express");
const {signInHandler,signUpHandler,sendPublicKey} = require("../controllers/authController");
const rateLimit = require('express-rate-limit');
const { requireAuth } = require("../middleware/requireAuth");
const authRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

authRouter.use(limiter);
authRouter.post("/signup",signUpHandler);
authRouter.post("/signin",limiter,signInHandler);
authRouter.get("/get-auth/:id",requireAuth);
authRouter.get("/get-public-key",sendPublicKey);

authRouter.all('*', (req, res) => {
    res.status(405).json({ 
        message: 'Method not allowed' 
    });
});

module.exports = {
    authRouter,
}