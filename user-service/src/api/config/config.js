require('dotenv').config();

const config = {
    PORT : process.env.PORT,
    MONGOURI: process.env.MONGO_URI,
    JWTSECRET: process.env.JWT_SECRET
}

module.exports = {
    config
};