const express = require("express");
const {createProduct} = require("../controllers/adminProductOpsController");
const {checkAuthorization} = require("../middleware/checkAuth");
const rateLimit = require('express-rate-limit');
const adminProductOpsRouter = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

adminProductOpsRouter.use(checkAuthorization("admin"));

adminProductOpsRouter.post("/create-product",createProduct);


