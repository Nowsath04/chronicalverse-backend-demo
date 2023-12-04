const express=require("express");
const { saveAuction } = require("../controller/auctionController");
const upload = require("../utils/fileUpload");
const router = express.Router();

router.post("/save-auction",upload.single("image"),saveAuction)


module.exports = router