const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const {connectToDB,getDB} = require("./config/database");
const {PORT,RATE_LIMIT} = require("../config/config");
const expressSanitizer = require("express-sanitizer");
const {adminProductOpsRouter} = require("./routes/adminProductOpsRoute");
const {customerProductOpsRouter} = require("./routes/customerProductOpsRoute");

const app = express();

app.use(helmet());
app.use(cors())

app.use(rateLimit(RATE_LIMIT));

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

app.use("product-service/api/admin",adminProductOpsRouter);
app.use("product-service/api/customer",customerProductOpsRouter);

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

app.listen(PORT, () => {
    console.log(`Product service running on http://localhost:${PORT}`);
});