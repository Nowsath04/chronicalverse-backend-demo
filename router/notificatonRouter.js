const express=require("express");
const { NotifyController, getNotify, updateNotification } = require("../controller/notificatonController");
const upload = require("../utils/fileUpload");

const router=express.Router()
router.route("/notification").post(upload.single("image"), NotifyController);
router.route("/notification/:userid").get(getNotify);
router.route("/notification/:userid").put(updateNotification);
module.exports=router