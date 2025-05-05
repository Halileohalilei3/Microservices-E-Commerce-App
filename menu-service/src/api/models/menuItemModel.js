const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Double } = require("mongodb");

const menuItemSchema = new Schema ({
    productId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    nameSnapshot:{ 
        type: String,   
        required: true 
    }, 
    priceSnapshot:{ 
        type: Double,   
        required: true 
    }, 
    quantity:{ 
        type: Number,   
        default: 1, 
        min: 1 
    },
      
})

module.exports = {
    menuItemSchema
}