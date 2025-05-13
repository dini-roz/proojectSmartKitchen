require("dotenv").config()
const express = require("express")
const connectDB=require('./config/dbConn')
const index = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT || 8888
index.use(cors());
index.use(express.json())
 index.use(bodyParser.json());

connectDB()
 
index.use("/api/users", userRoutes);

index.listen(PORT,()=>{
     console.log(`port ${PORT}`);
 })