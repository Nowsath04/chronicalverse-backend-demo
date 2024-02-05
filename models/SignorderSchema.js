const mongoose=require("mongoose")

const SignOrder=mongoose.Schema({
   
   amount:{
    type:Number,
    required:true
   },
   signature:{
      type:String,
      required:true
     },
     tokenId:{
    type:String,
    required:true
   },
   nftContract:{
    type:String,
    required:true
   },
   userAccount:{
      type:String,
      required:true
     },
     deadline:{
      type:String,
     }
})

const Users=mongoose.model("SignOrder",SignOrder)

module.exports=Users