const express=require("express");
const { CreateCollection, GetLoginUserCollection ,ConvertToUrl} = require("../controller/collectionController");
const jwtVerification = require("../middleware/jwtVerification");
const upload = require("../utils/fileUpload");


const router = express.Router();
router.post("/image-converted",upload.single("image"),ConvertToUrl)
router.post("/new-collection",jwtVerification,upload.single("image"),CreateCollection)
router.get("/login-user-collection/:id",jwtVerification,GetLoginUserCollection)

module.exports = router