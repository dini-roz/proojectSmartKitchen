const mongoose =require ("mongoose")
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.CONECTION_URL)
        console.log("mongoDB connected")
    }
    catch (err)
    {
        console.error("*****error connection to DB****\n" + err)
    }
}
module.exports=connectDB