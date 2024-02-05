const mongoose= require("mongoose")

const recommendedSchema=new mongoose.Schema({
    user: {
        type: String,
    },
    collection_id: {
        type: String,
    },
    counts:{
        type:Number,
        default:1
    }
})

const recommendedModel=mongoose.model("RecommendedNfts",recommendedSchema)
module.exports=recommendedModel