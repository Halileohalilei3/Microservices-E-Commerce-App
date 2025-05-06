const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Double } = require("mongodb");
const {menuItemSchema} = require("./menuItemModel");

const menuSchema = new Schema({
    ownerId:{ 
        type: mongoose.Types.ObjectId, 
        ref : 'User',
        required: true 
    },     
    items: [ 
        menuItemSchema 
    ],
    status:{ 
        type: String, 
        enum: ['open','ordered'], 
        default: 'open' 
    },
    menuPrice : {
        type : Double,
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    updatedAt:{ 
        type: Date, 
        default: Date.now 
    },
});
  
const Menu = mongoose.model("Menu",menuSchema);

module.exports = {
    Menu
}