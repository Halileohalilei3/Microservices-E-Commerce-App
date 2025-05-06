const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Double } = require("mongodb");

const productSchema = new Schema({
    productName : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim :true
    },
    price : {
        type : Double,
        required : true
    },
    imageUrl : {
        type : String,
    },
    rating: {
        type: Double,
        min: 0,
        max: 5
    },
    productCategory : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
    }
});

const Product = mongoose.model("Product",productSchema);

const Meal = Product.discriminator(
    "mealProduct",
    new Schema({
        preparationTimeInMinutes : {
            type : Number,
            required : true
        },
        ingredients : [{
            type : String,
            required : true
        }],
        weightInGrams: {
            type: Number, // in grams
            required: true
        }
    })
)

const Beverage = Product.discriminator(
    "beverageProduct",
    new Schema({
        volume : {
            type : Number,
            required : true
        }
    })
)

module.exports = {
    Product,
    Meal,
    Beverage
}