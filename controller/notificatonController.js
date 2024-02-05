const asyncHandler = require("../middleware/trycatch");
const Notifications = require("../models/NotifySchema");
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

exports.NotifyController = asyncHandler(async (req, res) => {
    const { notifyTo } = req.body;
    const { user } = req.body;
    const { bidprice } = req.body;
    const { Distillery } = req.body;
    const { pathname } = req.body;
    const { burnTokenName } = req.body;
    const { notificationType } = req.body;
    const { img } = req.body

    if (req.file) {
        const userImage = fs.readFileSync(req.file.path)
        let data = await uploadToS3(userImage);
        const draftData = {
            notifyTo: notifyTo,
            user: user,
            bidprice: bidprice,
            Distillery: Distillery,
            img: data,
            pathname: pathname,
            burnTokenName: burnTokenName,
            notificationType: notificationType
        }
        var draft = await Notifications.create(draftData)
        return res.json({
            draft,
            message: "valid token",
        })
    }else{
        const draftData = {
            notifyTo: notifyTo,
            user: user,
            bidprice: bidprice,
            Distillery: Distillery,
            img: img,
            pathname: pathname,
            burnTokenName: burnTokenName,
            notificationType: notificationType
        }
        var draft = await Notifications.create(draftData)
        return res.json({
            draft,
            message: "valid token",
        })
    }
   
})



exports.getNotify = asyncHandler(async (req, res) => {
    const { userid } = req.params;
    var draft = await Notifications.find({ notifyTo: userid }).populate('user')
    res.json({
        draft,
        message: "valid token",
    })
})

exports.updateNotification = async (req, res) => {
    const { userid } = req.params;
    try {
        var draft = await Notifications.updateMany({ notifyTo: userid }, { $set: { viewed: true } })
        res.json({
            draft,
            message: "valid token",
        })
    } catch (error) {
        console.log(error)

    }

}