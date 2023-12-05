const express=require("express");
const { saveAuction, getAuction } = require("../controller/auctionController");
const upload = require("../utils/fileUpload");
const router = express.Router();

router.post("/save-auction",upload.single("image"),saveAuction)
router.route("/get-auction").get(getAuction);

module.exports = router