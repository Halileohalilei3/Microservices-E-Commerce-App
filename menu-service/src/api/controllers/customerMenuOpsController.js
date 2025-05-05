const {Menu} = require("../models/menuModel");
const {getUser,ServiceError} = require("../middleware/getUser");
const axios = require("axios");

const getProductDetails = async (items) => {
    try {
        const response = await axios.post('http://localhost:4002/product-service/inter-service/bulk-fetch-products', {
            items: items
        });

        const products = response.data;

        return products;

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new ServiceError(
              data.message || "Service error",
              status
            );
          }
          
          console.error("Service unreachable:", error.message);
          throw new ServiceError(
            "Unable to contact to the Service",
            502 
          );
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

const getMenuDetails = async (req,res) => {
    try {
        const menu_id = req.params.id;

        const menu = await Menu.findById(menu_id).select("ownerId items status menuPrice createdAt");

        if(!menu){
            console.log(`Menu with ID : ${menu_id.toString()} could not be found`);
            return res.status(404).json({
                message : "Menu could not be found"
            })
        }

        let user;

        try {
            user = await getUser(menu.ownerId);
        } catch (err) {
            if (err instanceof ServiceError) {
              
              return res.status(err.statusCode).json({ 
                message: err.message 
              });
            }
            
            console.error("Unexpected error occurred while fetching user from user-service:", err);
            return res.status(500).json({ 
                message: "Internal Server Error" 
            });
        }

        const menu_detail = {
            _id : menu_id,
            ownerUsername : user.username,
            owner_id : menu.ownerId,
            items: menu.items,
            status: menu.status,
            menuPrice: menu.menuPrice,
            createdAt : menu.createdAt
        }

        console.log("Menu Detail successfully sent");
        return res.status(200).json(menu_detail);

    } catch (error) {
        console.error("Error while fetching menu details: ",error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const addProductsToMenu = async (req,res) => {
    try {
        const menu_id = req.params.id;
        const {items} = req.body;

        if(!items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({
                message : "You must add at least 1 product item to the menu"
            })
        }

        const menu = await Menu.findById(menu_id);

        if(!menu){
            console.log(`Menu with id ${menu_id.toString()} could not be found`);
            return res.status(404).json({
                message : "Menu could not be found"
            })
        }

        let products
        try {
            products = await getProductDetails(items);
        } catch (error) {
            if (err instanceof ServiceError) {
               return res.status(err.statusCode).json({ 
                  message: err.message 
                });
            }
              
            console.error("Unexpected error occurred while fetching products from product-service:", err);
            return res.status(500).json({ 
                message: "Internal Server Error" 
            });
        }

        let totalPrice = 0;
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
        })

        menu.items.push(...menuItems);
        menu.menuPrice = (menu.menuPrice || 0) + totalPrice;
        menu.updatedAt = new Date();

        await menu.save();

        return res.status(200).json({
            message : "Items added successfully",
            menu : "updated"
        })
        
    } catch (error) {
        console.error("Error while adding items to the menu: ",error.message);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

const deleteMenu = async (req, res) => {
    try {
      const menu_id = req.params.id;
      const userId  = req.user._id;
  
      
      if (!mongoose.Types.ObjectId.isValid(menu_id)) {
        return res.status(400).json({ 
            message: "Invalid menu ID" 
        });
      }
  
      const menu = await Menu.findById(menu_id);
      if (!menu) {
        return res.status(404).json({ 
            message: "Menu not found" 
        });
      }
  
      if (menu.ownerId.toString() !== userId.toString()) {
        return res.status(403).json({ 
            message: "You do not have permission to delete this menu" 
        });
      }
  
      await menu.deleteOne();  // or menu.remove()
  
      console.log(`Menu with ID : ${menu_id} deleted successfully.`);
      return res.status(200).json({ 
        message: "Menu deleted successfully" 
      });
  
    } catch (error) {
      console.error("Error deleting menu:", error);
      return res.status(500).json({ 
        message: "Internal Server Error" 
      });
    }
  };
module.exports = {
    createMenu,
    getMenuDetails,
    addProductsToMenu,
    deleteMenu
}