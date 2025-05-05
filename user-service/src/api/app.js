const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const {connectToDB,getDB} = require("./config/database");
const {userRouter} = require("./routes/userRoute");
const {authRouter} = require("./routes/authRoute");
const {interServiceOpsRouter} = require("./routes/interServiceRoute");
const {config} = require("./config/config");
const expressSanitizer = require("express-sanitizer");

const app = express();

app.use(helmet());
app.use(cors())

app.use(rateLimit(config.RATE_LIMIT));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(morgan('dev'));

connectToDB()
    .then(
        () => {
            console.log("Database Connection Successfull")
        }
    ).catch((error) => {
        console.error("Database connection failed: ",error);
        process.exit(1);
    })

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', db: getDB()?.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use("/user-service/api/users",userRouter);
app.use("/user-service/api/auth",authRouter);
app.use("/user-service/inter-service",interServiceOpsRouter)
app.use((req,res) => {
    res.status(404).json({
        message : "Route not found"
    })
});

app.use((err, req, res) => { 
    console.error('Error:', err.stack); 
    res.status(500).json({ 
        message: 'Internal Server Error' 
    }); 
});

app.listen(config.PORT, () => {
    console.log(`User service running on http://localhost:${config.PORT}`);
});