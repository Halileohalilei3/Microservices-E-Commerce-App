const axios = require("axios");
const jwt = require("jsonwwebtoken");

const getPublicKey = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user-service/api/auth/get-public-key");
      const publicKey = response.data;
      console.log("Public Key:", publicKey);
      return publicKey;
    } catch (error) {
      console.error("Failed to fetch public key:", error.message);
      throw error;
    }
};


const getUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/user-service/api/user/get-user/${id}`);
      const user = response.data;
      console.log("User:", user);
      return user;
    } catch (error) {
        console.error("Failed to fetch user:", error.message);
        throw error;  
    }
}

const checkAuthorization = async (req,res,next,roleOP) => {
    const {authorization} = req.headers;

    const public_key = await getPublicKey();

    if(!authorization){
        return res.status(401).json({
            message  :"Authorization token required"
        })
    }

    const token = authorization.split(" ")[1];
    
    try {
        const { _id } = jwt.verify(token,public_key);

        const user = await getUser(_id);

        req.user = user._id;
        req.role = user.role;

        if(roleOP === "admin" && req.role !== "admin"){
            return res.status(403).json({
                message : "Access denied"
            })
        }
        next();


        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Request is not authorized"
        })
    }
}

module.exports = {
    checkAuthorization
}