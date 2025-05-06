const express = require("express");
const {createOrder} = require("../controllers/customerOrderOpsController");
const {checkAuthorization} = require("../middleware/checkAuth");
const rateLimit = require('express-rate-limit');
const orderOpsRouter = express.Router();

/*
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});
*/
orderOpsRouter.use(checkAuthorization("customer"));
orderOpsRouter.post("/create-order/:id",createOrder);

module.exports = {
    orderOpsRouter
}