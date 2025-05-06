const mongoose = require('mongoose');
const {User}= require('../models/userModel'); 

const sendUserAddress = async (req, res) => {
  try {
    const user_id = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    
    const user = await User.findById(user_id).select("address");
      


    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    return res.status(200).json({ address: user.address });

  } catch (error) {
    console.error("sendUserAddress error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
    sendUserAddress
}