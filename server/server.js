require("dotenv").config()
const express = require("express")
const connectDB=require('./config/dbConn')
const index = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const userRoutes = require("./routes/userRoutes");
const loginRouter=require("./routes/loginRoutes")
const itemRouter=require("./routes/itemRouter")
const imageRoutes=require("./routes/imageRoutes")
const foodRouter=require("./routes/FoodRouter")
const PORT = process.env.PORT || 8888
index.use(cors());
index.use(express.json())
 index.use(bodyParser.json());

 connectDB()
const uploadsPath = path.join(__dirname, 'uploads');
console.log("Serving static files from:", uploadsPath);
index.use('/uploads', express.static(uploadsPath));
index.use("/api/users", userRoutes);
index.use("/api/login",loginRouter)
console.log("ddddd")

index.use("/api", itemRouter);
index.use("/api/",imageRoutes)
index.use('/api', foodRouter);
index.use(express.static(path.join(__dirname, 'uploads')));
index.listen(PORT,()=>{
     console.log(`port ${PORT}`);
 }) 