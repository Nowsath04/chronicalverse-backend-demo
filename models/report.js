const mongoose=require("mongoose")

const reportSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    content:{
        type:String,
        require:true
    }

})

 const reportModel=mongoose.model("reports",reportSchema)

 module.exports=reportModel