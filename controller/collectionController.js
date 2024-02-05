const asyncHandler = require("../middleware/trycatch");
const collectionModel = require("../models/collectionModel");
const ErrorHandler = require("../utils/ErrorHandler");
const AWS = require("aws-sdk")
const fs = require("fs");

const bucketName = process.env.aws_bucket;
const awsConfig = ({
    accessKeyId: process.env.AccessKey,
    secretAccessKey: process.env.SecretKey,
    region: process.env.region,
})

const S3 = new AWS.S3(awsConfig);
const uploadToS3 = (fileData) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key: `${Date.now().toString()}.jpg`,
            Body: fileData,
        };
        S3.upload(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data.Location);
        });
    });
};


exports.CreateCollection = asyncHandler(async (req, res, next) => {
    const userid = req.user._id;
    const { collectiontitle, collectionurl, collectiondescription, ipfshashvalue,collectionId } = req.body

    if (!userid) {
        return next(new ErrorHandler("user are unauthorization", 401))
    }
    const Collection = await collectionModel.create({ collectiontitle: collectiontitle, collectionurl: collectionurl, collectiondescription: collectiondescription, collectionIpfsValue: ipfshashvalue, collectionCreater: userid,collectionId })
    res.status(200).json({
        message: "success",
        Collection
    })
})
exports.GetLoginUserCollection = asyncHandler(async (req, res, next) => {
    const collectionCreater = req.params.id
    const collection = await collectionModel.find({ collectionCreater: collectionCreater });
    res.status(200).send({
        message: "success",
        collection
    })
})

exports.ConvertToUrl =async(req,res)=>{
    const imagePath = req.file.path
    const userImage = fs.readFileSync(imagePath)
  try {
    let data = await uploadToS3(userImage);
    res.json({
        data
    })
   
  } catch (error) {
    console.log(error);
  }
}