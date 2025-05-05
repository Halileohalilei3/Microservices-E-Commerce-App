const {Order} = require("../models/orderModel");
const {getMenuDetails,ServiceError,getUserAddress} = require("./internalServiceOps");
const mongoose = require("mongoose");
const createOrder = async (req,res) => {
    try {
        const sender_id = req.user._id;
        const menu_id = req.params.id;

        if(!menu_id) {
            return res.status(400).json({
                message : "Menu information missing"
            })
        }

        let address
        try {
            address = getUserAddress(sender_id);
        } catch (error) {
            if (err instanceof ServiceError) {
              
                return res.status(err.statusCode).json({ 
                  message: err.message 
                });
            }
              
            console.error("Unexpected error occurred while fetching menu data from menu-service:", err);
            return res.status(500).json({ 
                message: "Internal Server Error" 
            });
        }
        let menu
        try {
            menu = await getMenuDetails(menu_id);
        } catch (error) {
            if (err instanceof ServiceError) {
              
                return res.status(err.statusCode).json({ 
                  message: err.message 
                });
            }
              
              console.error("Unexpected error occurred while fetching menu data from menu-service:", err);
              return res.status(500).json({ 
                  message: "Internal Server Error" 
              });
        }

        if (menu.ownerId !== sender_id) {
            return res.status(403).json({ message: "You can only order your own menu" });
        }

        if (menu.status !== 'ordered') {
            return res.status(400).json({ message: "Menu must be finalized before ordering" });
        }

        const order = await Order.create({
            ownerId:         mongoose.Types.ObjectId(userId),
            menuId:          mongoose.Types.ObjectId(menuId),
            shippingAddress : address,
            totalPrice:      menu.menuPrice
        });

        return res.status(201).json({
            message:   "Order placed successfully",
            orderId:   order._id,
            total:     order.totalPrice,
            status:    order.status
        });
        
    } catch (error) {
        console.error("Error while creating Order");
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports = {
    createOrder
}