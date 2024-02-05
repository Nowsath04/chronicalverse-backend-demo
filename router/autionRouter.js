const express=require("express");
const { saveAuction, getAuction, getParticularAuction, UpadteParticularAuction, DeleateParticularAuction } = require("../controller/auctionController");
const upload = require("../utils/fileUpload");
const router = express.Router();

router.post("/save-auction",upload.single("image"),saveAuction)
router.route("/get-auction").get(getAuction);
router.route("/get-particular-action/:tokenid/:collectionId").get(getParticularAuction);
router.route("/update-particular-action/:tokenid/:collectionId/:auctionPrice").put(UpadteParticularAuction);
router.route("/delete-particular-action/:tokenid/:collectionId").delete(DeleateParticularAuction);

module.exports = router