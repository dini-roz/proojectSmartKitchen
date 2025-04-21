require("dotenv").config()
const express = require("express")
const index = express()

const PORT = process.env.PORT || 8888
index.listen(PORT,()=>{
    console.log(`port ${PORT}`);
})

index.get('/',(req,res)=>{
    res.send("kitchen")
      console.log("kitchen")
})
