const express = require("express");
const {sendUserAddress} = require("../controllers/interServiceOpsController.js");
const rateLimit = require('express-rate-limit');
const interServiceOpsRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

interServiceOpsRouter.use(limiter);

interServiceOpsRouter.get("/get-user-address/:id",sendUserAddress);

module.exports = {
    interServiceOpsRouter
}