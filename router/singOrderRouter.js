const express = require("express");

const {SignOrderController,loadSignOrder,removeSignOrder
} = require("../controller/signOrderController");
 const router = express.Router();


 router.route("/sign-order").post(SignOrderController);
 router.route("/sign-order/:token/:nftContract").get(loadSignOrder);
 router.route("/sign-order/:token/:nftContract").delete(removeSignOrder);

module.exports = router;
