const express = require("express");
const app = express();
const db = require("./config/database");
const http = require("http");

app.use(express.json());
require("dotenv").config();

const {eventRouter} = require("./routes/events");

app.use("/", eventRouter);

const server = http.createServer(app);

db.connect().then(()=>{
    console.log("Database Connection Successful");
    server.listen(process.env.PORT,()=>{
        console.log("Server running on port " + process.env.PORT);
        
    })
}).catch((err)=>{
    console.error("Database Not Connected");
})