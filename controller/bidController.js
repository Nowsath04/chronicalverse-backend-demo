const asyncHandler = require("../middleware/trycatch");
const AllBidDetails = require("../models/BidDetails");
const BidSchema = require("../models/BidSchema");
require('dotenv').config()

exports.BidController = asyncHandler(async (req, res, next) => {

    const { bidprice, lastBidUser, auctionId, tokenId, collectionId, owner } = req.body
    const bidData = {
        lastBidUser, bidprice, tokenId, collectionId, auctionId, bidprice, owner
    }
    var data = await BidSchema.create(bidData)
    res.json({
        data,
    })

})
exports.loadAllBids = asyncHandler(async (req, res) => {
    let data = await BidSchema.find({})
        .populate('user')
    res.json(data)

})

exports.LoadBidDetails = asyncHandler(async (req, res) => {
    let { tokenId } = req.params
    let { collectionId } = req.params
    let { auctionId } = req.params
    let data = await BidSchema.find({
        tokenId: tokenId, auctionId: auctionId, collectionId: collectionId
    })
        .populate('lastBidUser')
    res.json(data)
})

exports.RemoveFromSale = asyncHandler(async (req, res) => {
    const { id } = req.params;

    var draft = await BidSchema.findOneAndDelete({ auctionId: id })
    // var draft2 = await NftTokens.findOneAndDelete({ ipfs: ipfs })
    res.json({
        message: "draft loaded",
        draft,
    })


})

exports.updateBid = async (req, res) => {
    let { tokenId } = req.params
    let { collectionId } = req.params
    let { auctionId } = req.params
    let { lastBidUser } = req.params
    let { bidprice } = req.params

    let data = await BidSchema.findOneAndUpdate(
        { tokenId, auctionId, collectionId },
        { bidprice, lastBidUser },
        { new: true } // This option returns the updated document
    );

    if (data) {
        // Sending the updated document back to the frontend
        res.json(data);
    } else {
        res.status(404).json({ error: 'Document not found' });
    }

}


exports.bidDetails = asyncHandler(async (req, res) => {
    const { bidprice, BidUser, tokenId, collectionId } = req.body.data
    const data = await AllBidDetails.create({ bidprice, BidUser, tokenId, collectionId })
    res.status(200).json({
        message: "success"
    })


})

exports.getOneBidDetails = asyncHandler(async (req, res) => {
    const { collection_id, token_id } = req.params
    const bidDetails = await AllBidDetails.find({ collectionId: collection_id, tokenId: token_id }).populate("BidUser")
    res.status(200).json({
        message: "success",
        bidDetails
    })
})