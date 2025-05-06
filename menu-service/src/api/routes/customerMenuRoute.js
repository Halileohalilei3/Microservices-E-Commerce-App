const express = require("express");
const {checkAuthorization} = require("../middleware/checkAuth");
const rateLimit = require('express-rate-limit');
const customerMenuOpsRouter = express.Router();
const {createMenu, getMenuDetails,addProductsToMenu,deleteMenu} = require("../controllers/customerMenuOpsController");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Please try again later.'
});

customerMenuOpsRouter.use(checkAuthorization("customer"));

customerMenuOpsRouter.post("/create-menu",createMenu);
customerMenuOpsRouter.get("/get-menu-details/:id",getMenuDetails);
customerMenuOpsRouter.patch("/add-products-to-menu/:id",addProductsToMenu);
customerMenuOpsRouter.delete("/delete-menu/:id",deleteMenu);

module.exports = {
    customerMenuOpsRouter
}