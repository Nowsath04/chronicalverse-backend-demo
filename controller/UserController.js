
const { recoverPersonalSignature } = require("eth-sig-util");
const ethUtil = require('ethereumjs-util');
const User = require("../models/userModels");
const createJwt = require("../utils/jwt");
const AWS = require("aws-sdk")
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("../middleware/trycatch");

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



exports.CreateNonce = async (req, res, next) => {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const userid = req.body.userid;
    const user = await User.findOne({ userid })
    if (!userid) {
        return next(new ErrorHandler("userid is needed", 401))
    }
    try {
        if (!user) {
            const user = await User.create({ userid, nonce: nonce });
            return res.status(200).json({
                user
            })
        } else {
            const existUser = await User.findOneAndUpdate({nonce, new: true })
            const user = await User.findOne({ userid })
            return res.json({
                user
            })
        }
    } catch (error) {
        console.log(error);
    }

}



exports.CheckUser = asyncHandler(async (req, res, next) => {
    const { nonce, signature, userid } = req.body;
    try {
        const updatedUser = await User.findOne({ $and: [{ 'nonce': nonce }, { 'userid': userid }] })
        console.log(updatedUser);
        if (!updatedUser) {
            return next(new ErrorHandler("User not found", 401))
        }
        const msg = `Welcome to Iwc\n\nThis request will not trigger a blockchain\ntransaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:${updatedUser.userid}\nNonce:${updatedUser.nonce}`;
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });
        console.log(address.toLowerCase());
        console.log(userid.toLowerCase());
        if (address.toLowerCase() === userid.toLowerCase()) {
            createJwt(res, updatedUser)
        } else {
            res.status(401).send({
                error: 'Signature verification failed',
            });
            return null;
        }
        updatedUser.nonce = Math.floor(Math.random() * 1000000).toString();
        await updatedUser.save();
    } catch (error) {
        console.log(error);
    }
})

// update user

exports.UpdateUser = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const {name,email,bio,url}=req.body
   console.log(req.file);
       if (req.file) {
        const imagePath = req.file.path
        const userImage = fs.readFileSync(imagePath)
        let data = await uploadToS3(userImage);
        const user = await User.findByIdAndUpdate(req.user.id, { imgpath: data,name,email,bio,url })
       return res.status(201).json({
            success: true,
            user
        })
    }else{

        const user = await User.findByIdAndUpdate(req.user.id, { name,email,bio,url })
        res.status(201).json({
            success: true,
            user
        })
    }
})

//update Avatar


exports.updateavatar = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler("Select The Avatar Image", 401))
    }
        const imagePath = req.file.path
    const userAvatar = fs.readFileSync(imagePath)
    let data = await uploadToS3(userAvatar);
    const user = await User.findByIdAndUpdate(req.user.id, { coverimg: data })
    res.status(201).json({
        success: true
    })
})


//get login user Profile

exports.Myprofile = asyncHandler(async (req, res, next) => {
    let user = req.user
    user = await User.findById(req.user.id)
    res.status(201).json({
        success: true,
        user
    })
})




// logout user
exports.Userlogout = asyncHandler((req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: "logout successfully"
    })

})