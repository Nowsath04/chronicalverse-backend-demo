const mongoose = require("mongoose");

const AuctionToken = mongoose.Schema({
    collectionName: {
        type: String,
    },
    auctionPrice: {
        type: String,
    },
    pathname: {
        type: String,
    },
    endTime: {
        type: String,
    },
    image: {
        type: String,
    },
    ipfsImage: {
        type: String,
    },
    type: {
        type: String,
    },
    created_at: { type: Date, required: true, default: Date.now },
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Users`,
        //  required:true
    },
    auctionId: {
        type: String,
    }
});

const AuctionModel = mongoose.model("auctionToken", AuctionToken);

module.exports = AuctionModel;
