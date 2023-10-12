const mongoose=require("mongoose");


const DbConnection=()=>{
   try {
    mongoose.connect(process.env.MONGO_DB)
    console.log("Databasse is connected");
   } catch (error) {
    console.log(error);
   }
}

module.exports=DbConnection