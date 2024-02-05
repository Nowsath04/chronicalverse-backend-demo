const express = require("express");

const {BidController,LoadBidDetails,updateBid,loadAllBids,RemoveFromSale, bidDetails, getOneBidDetails
} = require("../controller/bidController");
const upload = require("../utils/fileUpload");
 const router = express.Router();

 router.route("/bid").post(upload.single("image"),BidController);
 router.route("/bid/:auctionId/:collectionId/:tokenId").get(LoadBidDetails);
 router.route("/bids").get(loadAllBids);
 router.route("/bid/delete/:id").get(RemoveFromSale);
 router.route("/bid-update/:auctionId/:collectionId/:tokenId/:bidprice/:lastBidUser").put(updateBid);
 router.route("/bid_details").post(bidDetails);
 router.route("/bid_details/:collection_id/:token_id").get(getOneBidDetails);


module.exports = router;
