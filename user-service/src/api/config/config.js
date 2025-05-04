require('dotenv').config();
const fs   = require('fs');
const path = require('path');

const PRIVATE_KEY_PATH = path.resolve(
    __dirname,                
    process.env.JWT_PRIVATE_KEY  
);

const PUBLIC_KEY_PATH = path.resolve(
    __dirname,                
    process.env.JWT_PUBLIC_KEY  
);
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
const config = {
    PORT : process.env.PORT,
    MONGOURI: process.env.MONGO_URI,
    JWT_PRIVATE_KEY: PRIVATE_KEY,
    JWT_PUBLIC_KEY: PUBLIC_KEY,
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000,
        max: 100
    }
}

module.exports = {
    config
};