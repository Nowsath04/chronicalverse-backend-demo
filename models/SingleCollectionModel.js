const mongoose = require('mongoose')

const nftSchema = mongoose.Schema({
    nfttoken: {
        type: String,
        required: true
    },
    nft_name: {
        type: String,
        required: true
    },
    nft_date: {
        type: String,
        required: true
    },

    created_at: { type: Date, required: true, default: Date.now },

    nft_description: {
        type: String,
        required: true
    },
    nft_additionalDetails: {
        type: String,
        required: true
    },
    nft_itemsdetails: {
        type: String,
    },
    nftIpfsValue: {
        type: String,
    },
    imgIpfsValue: {
        type: String,
    },
    image: {
        type: String
    },
    nftCreator: {
        type: String,
    },
    nft_owner: {
        type: String,
    },
    active: {
        default: 0,
        type: Number
    },
    collection_id : {
        type: String,
    }
}, {
    timestamps: true,
})

const nftSchemaModel = mongoose.model("SingleCollection", nftSchema)

module.exports = nftSchemaModel