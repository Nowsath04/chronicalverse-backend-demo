const express = require('express');
const jwtVerification = require('../middleware/jwtVerification');
const upload = require('../utils/fileUpload');
const { SingleCollectionController, nftDataController, nftAllData, nftPathId, getUserNFT, updateUserNFt, UpdateNft, getNFT, getUserNft,DeleteSingleNFT, getUserSaleNft, updateMoreNft, getUserCreatedNft, userLikeNft, getUserFavorites, GetHotCollection, GetSingleCollectionNft, NftOwner, getNftOwner, getCount } = require('../controller/SingleCollectionController');



const router = express.Router()

router.post("/new-single-collection",jwtVerification,upload.single("image"),nftDataController)
router.put("/update-nft/:tokenid/:collectionId",UpdateNft)
router.get("/nft-all-data",nftAllData)
router.get("/getnft/:id/:token/:collectionId",getNFT)
router.delete("/deletenft/:token/:collectionId",DeleteSingleNFT)
router.get("/user-nft/:userid",getUserNft)
router.get("/user-salenft/:userid",getUserSaleNft)
router.get("/user-creatednft/:userid",getUserCreatedNft)
router.post("/likeNft/:userid/:id",userLikeNft)
router.get("/likeNft/:userid",getUserFavorites)
router.get("/hot-collection",GetHotCollection)
router.get("/get-singlecollection-nft/:collection_id",GetSingleCollectionNft)
router.post("/nft-owner",NftOwner)
router.post("/nft-owner/:tokenId/:collectionId",getNftOwner)
router.get("/get-count",getCount)



module.exports = router