const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken");

const requireAuth = async (req,res,next) => {

    //verify the authentication of the user
    const {authorization} = req.headers;

    //if it's not authorized send error
    if(!authorization){
        return res.status(401).json({
            message : "Authorization token required"
        })
    };

    //getting the token by splitting from authorization value.
    const token = authorization.split(" ")[1];

    //verifying that the token is valid and it didn't change.
    try {
        const {_id} = jwt.verify(token,process.env.TOKEN_SECRET);

        //Finding the user with given id taken from the token AND assigning it to the req parameters 
        //      so that it can be used in other functions
        req.user = await User.findOne({ _id }).select("_id");
        
        next();
        
    }catch (error){
        console.log(error);
        res.status(401).json({
            message: "Request is not authorized"
        })
    }

}


module.exports = {
    requireAuth,
}