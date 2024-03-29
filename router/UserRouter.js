const express=require("express");
const { CreateNonce, CheckUser, UpdateUser, updateavatar, Myprofile, Userlogout, getAllUser, getWhistlistAllUser, ChangeTowhiteListUser, 
    GetOtherUserData, userFollowing, getFollowing, UnFollowUser, getFollowers, contactUsData, reportUser, FindUser } = require("../controller/UserController");
const upload = require("../utils/fileUpload");
const jwtVerification = require("../middleware/jwtVerification");


const router=express.Router();


router.post("/generate-nonce",CreateNonce)
router.post("/verify-login",CheckUser)
router.get("/logout",Userlogout)
router.get("/getalluser",getAllUser)
router.get("/oneuser/:userid",GetOtherUserData)
router.get("/getall-whitelistuser",getWhistlistAllUser)
router.post("/convert-whiteListuser",ChangeTowhiteListUser)
router.post("/update-user",jwtVerification,upload.single("image"),UpdateUser)
router.post("/update-avatar",jwtVerification,upload.single("image"),updateavatar)
router.get("/myprofile",jwtVerification,Myprofile)
router.post("/following/:userid/:followerid",jwtVerification,userFollowing)
router.post("/unfollowing/:userid/:followerid",jwtVerification,UnFollowUser)
router.get("/getfollowing/:userid",getFollowing)
router.get("/getfollowers/:userid",getFollowers)
router.post("/getcontact",contactUsData)
router.post("/report",reportUser)
router.get("/findUser/:userid",FindUser)

module.exports =router