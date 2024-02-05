
const AWS = require("aws-sdk")
const fs = require("fs");
const asyncHandler = require("../middleware/trycatch");
const AuctionModel = require("../models/AutionNftSchema");
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


exports.saveAuction = asyncHandler(async (req, res) => {

    const { creater, endTime, pathname, collectionName, ipfsImage, auctionPrice, auctionId, tokenId, collectionId,description } = req.body

    const imagePath = req.file.path
    const userImage = fs.readFileSync(imagePath)
    let data = await uploadToS3(userImage);

    var draft = await AuctionModel.create({ creater, endTime, pathname, collectionName, ipfsImage, auctionPrice, auctionId, image: data, collectionId, tokenId,description })
    res.json({
        draft,
        message: "valid token",
    })

})


exports.getAuction = asyncHandler(
    async (req, res) => {
        var draft = await AuctionModel.find({}).populate('creater')
        res.json({
            message: "draft loaded",
            draft
        })
    }
)


exports.getParticularAuction = asyncHandler(async (req, res) => {
    const { tokenid, collectionId } = req.params
    var draft = await AuctionModel.findOne({ collectionId: collectionId, tokenId: tokenid })
    res.json({
        message: "Success",
        draft
    })
}
)

exports.UpadteParticularAuction = asyncHandler(async (req, res) => {
    const { tokenid, collectionId,auctionPrice } = req.params
    var draft = await AuctionModel.findOneAndUpdate({ collectionId: collectionId, tokenId: tokenid },{auctionPrice:auctionPrice})
    res.json({
        message: "Success",

    })
}
)

exports.DeleateParticularAuction =asyncHandler(async(req,res)=>{
    const { tokenid, collectionId } = req.params
    const deleteAuction=await AuctionModel.findOneAndDelete({ collectionId: collectionId, tokenId: tokenid })
    res.json({
        message: "deleted",
    })
})