const {Menu} = require("../models/menuModel");

const sendMenu = async (req,res) => {
    const { id } = req.body;
    try {
      const menu = await Menu.findById(id).select("-updatedAt");

      if (!menu) {
        return res.status(404).json({ message: "User not found" });
      } 
  
      return res.status(200).json(menu);
    } catch (err) {
      return res.status(500).json({ 
        message: "Internal Server Error" 
      });
    }
}

module.exports = {
    sendMenu
}