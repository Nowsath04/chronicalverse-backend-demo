const mongoose = require("mongoose")

const BidDetails = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Users`,
    required: true
  },
  lastBidUser: {
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
  auctionId: {
    type: String,
    required: true
  }
})

const Bid = mongoose.model("BidDetails", BidDetails)

module.exports = Bid