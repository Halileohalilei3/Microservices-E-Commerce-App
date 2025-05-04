const {Product,Beverage,Meal} = require("../models/productModel");


const getProductDetails = async (req,res) => {
    try {
        const product_id = req.params.id;

        if(!product_id){
            return res.status(400).json({
                message : "Missing product information"
            })
        }

        const product = await Product.findById(product_id)

        if(!product){
            return res.status(404).json({
                message : "Product not found"
            })
        }

        let productdetail;

        if(product.__t === "mealProduct"){
            productdetail = {
                _id : product._id,
                productName : product.productName,
                description : product.description,
                productCategory : product.productCategory,
                price : product.price,
                image : product.imageUrl,
                rating : product.rating,
                category : product.productCategory,
                preparationtime : product.preparationTimeInMinutes,
                ingredients : product.ingredients,
                weight : product.weightInGrams,
            }
        }else if(product.__t === "beverageProduct"){
            productdetail = {
                _id : product._id,
                productName : product.productName,
                description : product.description,
                productCategory : product.productCategory,
                price : product.price,
                image : product.imageUrl,
                rating : product.rating,
                category : product.productCategory,
                volume : product.volume
            }
        }

        return res.status(200).json(productdetail);


    } catch (error) {
        console.error("Error while retrieving product details: ",error.message);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports = {
    getProductDetails
}