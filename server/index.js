require("dotenv").config()
const express = require("express")
const connectDB=require('./config/dbConn')
const index = express()


const PORT = process.env.PORT || 8888

connectDB()

index.listen(PORT,()=>{
    console.log(`port ${PORT}`);
})

index.get('/',(req,res)=>{
    res.send("kitchen")
      console.log("kitchen")
})
//index.use(express.json()); // Middleware to parse JSON requests
//index.use('/api/auth', authRoutes); // Register the auth routes


// index.use("/api/auth",require("./router/authRoutes"))


index.use(express.json())
//index.use("/api/auth",require("./router/authRoutes"))

index.use("api/auth",require("./routes/authRoutes"))