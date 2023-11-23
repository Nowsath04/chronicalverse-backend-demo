const express=require("express");
const { CreateCollection } = require("../controller/collectionController");
const jwtVerification = require("../middleware/jwtVerification");
const upload = require("../utils/fileUpload");


const router = express.Router();

router.post("/new-collection",jwtVerification,upload.single("image"),CreateCollection)

module.exports =router