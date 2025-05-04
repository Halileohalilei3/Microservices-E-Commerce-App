const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName : {
        type : String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [3, 'First name should at least 3 characters long.'],
        maxlength: [25, 'First name should at most 25 characters long.']
    },
    lastName : {
        type : String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name should at least 2 characters long.'],
        maxlength: [20, 'Last name should at most 25 characters long.']
    },
    username : {
        type : String,
        required : true,
        trim: true,
        minlength: [2, 'Username should at least 2 characters long.'],
        maxlength: [20, 'Username should at most 20 characters long.']
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    role: {
      type: String,
      enum: ['admin','customer'],
      default: 'customer',
      required: true
    },
    profilePhoto : {
        type : String,
        default : ""
    },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        }
    },
    addresses: [{
        type: {
          street: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String },
          postalCode: { type: String, required: true },
          country: { type: String, required: true },
          isDefault: { type: Boolean, default: false }
        }
    }],
    paymentMethods: [{
        type: {
          cardType: { type: String, enum: ['visa', 'mastercard', 'amex'] },
          last4: { 
            type: String,
            validate: [
                {
                  validator: function(v) {
                    return /^[0-9]{4}$/.test(v);
                  },
                  message: 'Last 4 must be exactly 4 digits'
                },
                {
                  validator: function(v) {
                    if (this.cardType === 'amex') {
                      return v.startsWith('3'); // Amex cards start with 3
                    }
                    return true;
                  },
                  message: 'AMEX cards must start with 3'
                }
              ], 
          },
          expiry: { 
            type: String,
            validate: {
                validator: function(v) {
                  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(v)) return false;
                  
                  const [month, year] = v.split(/\D/);
                  const expiryDate = new Date(`20${year}`, month);
                  return expiryDate > new Date();
                },
                message: 'Expiry date must be in MM/YY format and in the future'
            }, 
          }
        }
    }],
    orderHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
})

userSchema.pre("save", async function(next) {

    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    
    next();
});

const User = mongoose.model("User", userSchema );




module.exports = {
    User,

}