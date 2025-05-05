const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  street:   { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state:  { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  country:  { 
    type: String, 
    required: true 
  },
});

const OrderSchema = new Schema({
  ownerId:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  menuId:   { 
    type: Schema.Types.ObjectId, 
    ref: 'Menu', 
    required: true 
  },
  shippingAddress: AddressSchema,
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status:   { 
    type: String, 
    enum: ['created','paid','shipped','cancelled'], 
    default: 'created' 
  },
  createdAt:{ 
    type: Date, 
    default: Date.now 
  }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = {
    Order
}