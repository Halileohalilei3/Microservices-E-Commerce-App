const {User} = require("../models/userModel");

const addUserAddress = async (req,res) => {
    try {
        const sender_id = req.user._id;
        const {address} = req.body;

        if(!address || !address.city || !address.street || !address.state || !address.postalCode || !address.country){
            return res.status(400).json({
                message : "Missing address information."
            })
        }

        const user = await User.findById({sender_id}).select("addresses updatedAt");

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        };

        const newAddress = {
            street : address.street.trim(),
            city : address.city.trim(),
            state : address.state.trim(),
            postalCode : address.postalCode().toString().trim(),
            country : address.country.trim(), 
            isDefault: address.isDefault || false
        }

        if (newAddress.isDefault) {
            // Reset all other addresses to non-default
            user.addresses.forEach(addr => { addr.isDefault = false; });
        } else if (user.addresses.length === 0) {
            // First address should default to true
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        user.updatedAt = new Date();

        await user.save();

        return res.status(200).json({
            message : "Address added successfully",
            address : newAddress
        });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
              message: "Validation failed",
              errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({
            message: "An error occurred on server. Please try again later",
        });
    }
}

const addPhoneNumber = async (req,res) => {
    try {
        const sender_id = req.user._id;
        const {number} = req.body;

        if(!number){
            return res.status(400).json({
                message : "Missing phone number"
            })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { 
              phone: number,
              updatedAt: new Date() 
            },
            { 
              new: true,
              runValidators: true // Ensures schema validation runs
            }
          ).select('phone');

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        return res.status(200).json({
            message : "Phone number added successfully"
        });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
              message: "Validation failed",
              errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({
            message: "An error occurred on server. Please try again later",
        });
    }
}

module.exports = {
    addPhoneNumber,
    addUserAddress
}