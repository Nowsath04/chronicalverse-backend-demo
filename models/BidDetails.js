const mongoose = require("mongoose")

const BidDetailsSchema = new mongoose.Schema({

    BidUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Users`,
    },
    bidprice: {
        type: Number,
        required: true
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

const AllBidDetails = mongoose.model("AllBidDetails", BidDetailsSchema)

module.exports = AllBidDetails