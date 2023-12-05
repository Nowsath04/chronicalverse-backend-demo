const express = require('express');
const jwtVerification = require('../middleware/jwtVerification');
const upload = require('../utils/fileUpload');
const { SingleCollectionController, nftDataController, nftAllData, nftPathId, getUserNFT, updateUserNFt } = require('../controller/SingleCollectionController');



const router = express.Router()

router.post("/new-single-collection",jwtVerification,upload.single("image"),nftDataController)
router.get("/nft-all-data",nftAllData)
router.get("/getnft/:id/:token/:collectionId",getUserNFT)

module.exports = router