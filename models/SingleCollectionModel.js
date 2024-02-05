const mongoose = require('mongoose')

const nftSchema = new mongoose.Schema({
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
    removed: {
        type: Boolean,
        default: false
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
    collection_id: {
        type: String,
    },
    pathname: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Users`,
        //  required:true
    },
    amount: {
        type: String,
        default: "0"
    },
    type: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null,
        select: false,
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        select: false,
    },
    nftOnsale: {
        type: Boolean,
        default:false
    },
}, {
    timestamps: true,
})

const nftSchemaModel = mongoose.model("NftDatas", nftSchema)

module.exports = nftSchemaModel