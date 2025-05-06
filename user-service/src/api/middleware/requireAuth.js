const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {config} = require("../config/config");
const requireAuth = async (req,res,next) => {

    //verify the authentication of the user
    const {authorization} = req.headers;

    //if it's not authorized send error
    if(!authorization){
        return res.status(401).json({
            message : "Authorization token required"
        })
    };
    //console.log("Authorization coming from client: ", authorization);
    //getting the token by splitting from authorization value.
    const token = authorization.split(" ")[1];

    //verifying that the token is valid and it didn't change.
    try {
        //const {_id} = jwt.verify(token,config.JWT_PRIVATE_KEY);
        const { userId, role } = jwt.verify(token, config.JWT_PUBLIC_KEY, { 
            algorithms: ['RS256'],
            issuer: 'http://localhost:4001/user-service',
            audience: 'internal-services'
        });
        //Finding the user with given id taken from the token AND assigning it to the req parameters 
        //      so that it can be used in other functions
        req.user = await User.findOne({ _id : userId}).select("_id");
        req.role = await User.findOne({ _id : userId}).select("role");
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