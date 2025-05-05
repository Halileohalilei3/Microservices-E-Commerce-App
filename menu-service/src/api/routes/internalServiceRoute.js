const express = require("express");
const {checkAuthorization} = require("../middleware/checkAuth");
const rateLimit = require('express-rate-limit');
const internalServiceRouter = express.Router();
const {sendMenu} = require("../controllers/internalServiceOpsController");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

internalServiceRouter.get("/send-menu/:id",sendMenu);

module.exports = {
    internalServiceRouter
}