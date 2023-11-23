const asyncHandler = require("../middleware/trycatch");
const collectionModel = require("../models/collectionModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.CreateCollection=asyncHandler(async(req,res,next)=>{
    console.log(req.body);
const userid=req.user._id;
const {collectiontitle,collectionurl,collectiondescription,ipfshashvalue}=req.body

if(!userid){
    return next(new ErrorHandler("user are unauthorization", 401))
}
const Collection =await collectionModel.create({collectiontitle:collectiontitle,collectionurl:collectionurl,collectiondescription:collectiondescription,collectionIpfsValue:ipfshashvalue,collectionCreater:userid})
    res.status(200).json({
        message:"success",
        Collection
    })
})