const express = require("express");
const {createProduct,getProductDetails} = require("../controllers/adminProductOpsController");
const {checkAuthorization} = require("../middleware/checkAuth");
const rateLimit = require('express-rate-limit');
const adminProductOpsRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

adminProductOpsRouter.use(checkAuthorization("admin"));

adminProductOpsRouter.post("/create-product",limiter,createProduct);
adminProductOpsRouter.get("/get-product-details/:id",limiter,getProductDetails);

module.exports = {
    adminProductOpsRouter
}

