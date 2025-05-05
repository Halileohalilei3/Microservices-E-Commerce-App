const {Product,Beverage,Meal} = require("../models/productModel");
const mongoose = require("mongoose");


const bulkFetchProducts = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                message: "Invalid or empty IDs array" 
            });
        }
        
        const productIds = items.map(item => item.productId);

        const validIds = productIds.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validIds.length === 0) {
            return res.status(400).json({ 
                message: "No valid product IDs provided" 
            });
        }

        const products = await Product.find({ _id: { $in: validIds } });

        const foundIds = products.map(p => p._id.toString());
        const missingIds = validIds.filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
            return res.status(400).json({
                message: "Products were not found",
            });
        }
        
        const productSnapshots = products.map(p => ({
            _id: p._id,
            nameSnapshot: p.productName,
            priceSnapshot: p.price,
        }));

        return res.status(200).json(productSnapshots);

    } catch (error) {
        console.error("Bulk fetch products error:", error.message);
        return res.status(500).json({ 
            message: "Server error while fetching products" 
        });
    }
};

module.exports = {
    bulkFetchProducts
}