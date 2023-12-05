const express = require('express');
const jwtVerification = require('../middleware/jwtVerification');
const upload = require('../utils/fileUpload');
const { SingleCollectionController, nftDataController, UpdateNft } = require('../controller/SingleCollectionController');



const router = express.Router()

router.post("/new-single-collection",jwtVerification,upload.single("image"),nftDataController)
router.put("/update-nft/:tokenid/:collectionId",jwtVerification,UpdateNft)


module.exports = router