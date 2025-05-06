const axios = require("axios");
const jwt = require("jsonwebtoken");

/*
const getPublicKey = async () => {
    try {
      const response = await axios.get("http://localhost:4001/user-service/api/auth/get-public-key");
      const publicKey = response.data;
      console.log("Public Key:", publicKey);
      return publicKey;
    } catch (error) {
      console.error("Failed to fetch public key:", error.message);
      throw error;
    }
};
*/
const getPublicKey = async () => {
    try {
      const {data} = await axios.get("http://localhost:4001/user-service/api/auth/get-public-key");
      console.log("Public key fetch response: ",data);
      const publicKey = data.publicKey;
      console.log("Public Key:", publicKey);
      return publicKey;
    } catch (error) {
      console.error("Failed to fetch public key:", error.message);
      throw error;
    }
};
/*
const getUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4001/user-service/api/user/get-user/${id}`);
      const user = response.data;
      console.log("User:", user);
      return user;
    } catch (error) {
        console.error("Failed to fetch user:", error.message);
        throw error;  
    }
}
*/
const getUser = async (id) => {
    try {
      console.log("Get User Request taken");
      //const objectId = new mongoose.Types.ObjectId(id);  
      const response = await axios.get(`http://localhost:4001/user-service/api/users/get-user/${id}`);
      const user = response.data;
      console.log("User: ", user);
      return user;
    } catch (error) {
        console.error("Failed to fetch user:", error.message);
        throw error;  
    }
}
/*
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
*/
const checkAuthorization = (roleOP) => {
    return async (req, res, next) => {
        try {
            console.log("All Headers: ",req.headers);
            const { authorization } = req.headers;
            console.log("Authorization info: ",authorization);
            if (!authorization) {
                return res.status(401).json({
                    message: "Authorization token required"
                });
            }

            
            const token = authorization.split(' ')[1];
            console.log("Token from client: ", token);
            if (!token) {
                return res.status(401).json({
                    message: "Invalid authorization format. Use 'Bearer <token>'"
                });
            }

            
            const public_key = await getPublicKey();
            if (!public_key) {
                return res.status(500).json({
                    message: "Server configuration error"
                });
            }

            
            let decoded;
            try {
                decoded = jwt.verify(token, public_key);
                console.log("Decoded token: ",decoded);
            } catch (err) {
                console.error("JWT verification failed:", err.message);
                return res.status(401).json({
                    message: "Invalid or expired token"
                });
            }

            console.log("Decoded user ID from token: ",decoded.userId);
            const user = await getUser(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            
            req.user = user._id;
            req.role = user.role;

            
            if (roleOP === "admin" && req.role !== "admin") {
                return res.status(403).json({
                    message: "Access denied. Admin privileges required"
                });
            }

            
            next();

        } catch (error) {
            console.error("Authorization middleware error:", error);
            return res.status(500).json({
                message: "Internal server error during authorization"
            });
        }
    };
};
module.exports = {
    checkAuthorization,
    getUser
}