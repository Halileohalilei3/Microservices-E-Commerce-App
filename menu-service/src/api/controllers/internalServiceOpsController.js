const {Menu} = require("../models/menuModel");
const mongoose = require("mongoose");

const sendMenu = async (req,res) => {
    
    const menu_id = req.params.id;
    try {
      if (!mongoose.Types.ObjectId.isValid(menu_id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const menu = await Menu.findById(menu_id).select("-updatedAt");

      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      } 
  
      return res.status(200).json(menu);
    } catch (error) {
      console.log("Error while fetching menu for internal service: ",error.message);
      return res.status(500).json({ 
        message: "Internal Server Error" 
      });
    }
}

module.exports = {
    sendMenu
}