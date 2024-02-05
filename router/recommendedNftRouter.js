const express= require("express")
const { RecommendedNft, getUserRecommendedNft } = require("../controller/recommendedNftController")

const router=express.Router()

router.post("/user-recommended",RecommendedNft)
router.get("/user-recommended/:user_id",getUserRecommendedNft)
module.exports=router