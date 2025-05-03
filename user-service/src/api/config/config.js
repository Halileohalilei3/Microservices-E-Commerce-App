require('dotenv').config();

const config = {
    PORT : process.env.PORT,
    MONGOURI: process.env.MONGO_URI,
    JWTSECRET: process.env.JWT_SECRET,
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000,
        max: 100
    }
}

module.exports = {
    config
};