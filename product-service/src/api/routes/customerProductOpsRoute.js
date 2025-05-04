const express = require("express");
const {getProductDetails} = require("../controllers/customerProductOpsController");
const {checkAuthorization} = require("../middleware/checkAuth");
const rateLimit = require('express-rate-limit');
const customerProductOpsRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

customerProductOpsRouter.use(checkAuthorization("customer"));

customerProductOpsRouter.get("/get-product-details/:id",limiter,getProductDetails);

module.exports = {
    customerProductOpsRouter
}