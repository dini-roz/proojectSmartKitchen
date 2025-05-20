require("dotenv").config()
const express = require("express")
const connectDB=require('./config/dbConn')
const index = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const loginRouter=require("./routes/loginRoutes")
const PORT = process.env.PORT || 8888
index.use(cors());
index.use(express.json())
 index.use(bodyParser.json());

connectDB()
 
index.use("/api/users", userRoutes);
index.use("/api/login",loginRouter)
index.listen(PORT,()=>{
     console.log(`port ${PORT}`);
 }) 