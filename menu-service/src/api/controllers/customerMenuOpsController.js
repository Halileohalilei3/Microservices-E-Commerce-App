const {Menu} = require("../models/menuModel");
const {getUser} = require("../middleware/getUser");
const axios = require("axios");

const getProductDetails = async (items) => {
    try {
        const response = await axios.post('http://localhost:4002/product-service/inter-service/bulk-fetch-products', {
            items: items
        });

        const products = response.data;

        return products;

    } catch (error) {
        console.error("Error while fetching product Data: ",error);
        throw new Error("Failed to fetch product data");
    }
}

const createMenu = async (req,res) => {
    try {
        const sender_id = req.user._id;
        const {items} = req.body;


        if(!items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({
                message : "You must add at least 1 product item to the menu"
            })
        }


        const products = await getProductDetails(items);
        let totalPrice;
        const menuItems = products.map(product => {
            const matchedItem = items.find(i => i.productId === product._id.toString());
            const quantity = matchedItem.quantity;

            const singleProductPrice = product.priceSnapshot * quantity;
            totalPrice += singleProductPrice;

            return {
                productId: product._id,
                nameSnapshot: product.nameSnapshot,
                priceSnapshot: product.priceSnapshot,
                quantity: quantity
            };
        });

        const newMenu = new Menu({
            ownerId: sender_id,
            items: menuItems,
            menuPrice: totalPrice
        });

        await newMenu.save();

        return res.status(201).json({
            message: "Menu created successfully",
        });
    } catch (error) {
        console.error("Error while creating menu:", error.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createMenu
}