const mongoose = require("mongoose");
const {MONGOURI} = require("./config");

let dbConnection;


async function connectToDB() {
    try {
        mongoose.set("strictQuery",false);

        dbConnection = await mongoose.connect(MONGOURI, {
            serverSelectionTimeoutMS : 5000,
            maxPoolSize : 10,
            maxIdleTimeMS
        });

        dbConnection.on("error", (error) => {
            console.error("Database Connection Error",error);

            setTimeout(() => {
                mongoose.connect(MONGOURI).catch(e => console.error('Reconnect failed:', e));
            }, 5000);
        });

        dbConnection.on("disconnected", () => {
            console.log("Database Disconnected. Reconnecting...");
            setTimeout(connectToDB,3000);
        });

        console.log("Database Connection Successfull");
        return dbConnection;

    } catch (error) {
        console.error("Failed to connect to the Database: ",error);
        throw error;
    }
}

function getDB () {
    return dbConnection;
}

module.exports = {
    connectToDB ,
    getDB 
}