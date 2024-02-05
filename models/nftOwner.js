const mongoose = require("mongoose")

const nftOwnerSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    tokenId: {
        type: String,
        required: true
    },
    collectionId: {
        type: String,
        required: true
    },

})

const nftOwnerModel=mongoose.model("nftOwners",nftOwnerSchema)

module.exports =nftOwnerModel