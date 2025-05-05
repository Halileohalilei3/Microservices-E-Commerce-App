const express = require("express");
const {bulkFetchProducts} = require("../controllers/serviceInternalOpsController");
const {checkAuthorization} = require("../middleware/checkAuth");
const serviceProductInternalRouter = express.Router();

serviceProductInternalRouter.post("/bulk-fetch-products",bulkFetchProducts);


module.exports = {
    serviceProductInternalRouter
}