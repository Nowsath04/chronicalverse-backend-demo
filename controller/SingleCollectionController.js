const asyncHandler = require("../middleware/trycatch");
const nftSchemaModel = require("../models/SingleCollectionModel");
const singleCollectionModel = require("../models/SingleCollectionModel");
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

exports.nftDataController = asyncHandler(async (req, res, next) => {
    const {collection_id,nft_token,nft_name,nft_owner,image_hash,nfthashvalue,nft_date,nft_description,nft_additionalDetails,nft_itemsdetails,nft_creator} = req.body
    const imagePath = req.file.path
    const userImage = fs.readFileSync(imagePath)
    let data = await uploadToS3(userImage);

    const nftData = await nftSchemaModel.create({
        collection_id:collection_id,
        nfttoken:nft_token,
        nft_name:nft_name,
        nft_owner:nft_owner,
        imgIpfsValue:image_hash,
        nfthashvalue:nfthashvalue,
        nft_date:nft_date,
        nft_description:nft_description,
        nft_additionalDetails:nft_additionalDetails,
        nft_itemsdetails:nft_itemsdetails,
        nft_creator:nft_creator,        
        image:data,
    })

//     if(!userid){
//         return next(new ErrorHandler("user are unauthorization", 401))
//     }
// const SingleCollection = await singleCollectionModel.create(req.body)
// console.log(req.body);

// res.status(200).json({
//     message:"success",
//     SingleCollection
// })
})