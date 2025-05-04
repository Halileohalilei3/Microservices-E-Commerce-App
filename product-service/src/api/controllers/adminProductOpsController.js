const {Product,Beverage,Meal} = require("../models/productModel");
const {getUser} = require("../middleware/getUser");

const createProduct = async (req, res) => {
    try {
      const sender_id = req.user; 
      const {
        productName,
        description,
        price,
        productType, 
        ingredients,
        preparationTime,
        weight,
        productCategory,
        volume
      } = req.body;
      

      let newProduct;
      
      if (productType === "meal") {
        newProduct = new Meal({
          productName : productName,
          description : description,
          price : price,
          ingredients : ingredients,
          preparationTimeInMinutes : preparationTime,
          weightInGrams : weight,
          createdBy: sender_id,
          productCategory : productCategory
        });
      } else if (productType === "beverage") {
        newProduct = new Beverage({
          productName : productName,
          description : description,
          price : price,
          productType,
          volume,
          createdBy: sender_id
        });
      } else {
        return res.status(400).json({ 
            message: "Invalid product type" 
        });
      }
  
      await newProduct.save();
      return res.status(201).json({
        message: "Product created successfully",
      });
    } catch (error) {
      console.error("Error while creating product:", error.message);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
};

const getProductDetails = async (req,res) => {
    try {
        const product_id = req.params.id;
        const sender_id = req.user._id;

        if(!product_id){
            return res.status(400).json({
                message : "Missing product information"
            })
        }

        const product = await Product.findById(product_id).select("-createdAt -updatedAt");

        if(!product){
            return res.status(404).json({
                message : "Product not found"
            })
        }

        const adder = await getUser(product.createdBy);

        if (!adder) {
            return res.status(404).json({ message: "User not found" });
        }

        let productdetail;

        if(product.__t === "mealProduct"){
            productdetail = {
                _id : product._id,
                addedBy : user.username,
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
                addedBy : adder.username,
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
    getProductDetails,
    createProduct
}