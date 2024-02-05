
const { recoverPersonalSignature } = require("eth-sig-util");
const ethUtil = require('ethereumjs-util');
const User = require("../models/userModels");
const createJwt = require("../utils/jwt");
const AWS = require("aws-sdk")
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("../middleware/trycatch");
const Users = require("../models/userModels");
const contactUsModel = require("../models/contactUs");
const reportModel = require("../models/report");

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
            const existUser = await User.findOneAndUpdate({ nonce, new: true })
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
        if (!updatedUser) {
            return next(new ErrorHandler("User not found", 401))
        }
        const msg = `Welcome to Iwc\n\nThis request will not trigger a blockchain\ntransaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:${updatedUser.userid}\nNonce:${updatedUser.nonce}`;
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

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
    const { name, email, bio, url } = req.body
    if (req.file) {
        const imagePath = req.file.path
        const userImage = fs.readFileSync(imagePath)
        let data = await uploadToS3(userImage);
        const user = await User.findByIdAndUpdate(req.user.id, { imgpath: data, name, email, bio, url })
        return res.status(201).json({
            success: true,
            user
        })
    } else {

        const user = await User.findByIdAndUpdate(req.user.id, { name, email, bio, url })
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
exports.Userlogout = asyncHandler(async (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: "logout successfully"
    })

})
// get all user
exports.getAllUser = asyncHandler(async (req, res) => {

    const allUser = await User.find({})
    res.status(200).json({
        message: "success",
        allUser
    })
})
exports.getWhistlistAllUser = asyncHandler(async (req, res) => {

    const allUser = await User.find({ whiteListUser: true })
    res.status(200).json({
        message: "success",
        allUser
    })
})
exports.ChangeTowhiteListUser = asyncHandler(async (req, res) => {
    const { user } = req.body
    const updateuser = user.map(async (userid) => {
        const user = await User.findOneAndUpdate({ userid }, { whiteListUser: true },
            { new: true })
    })
    console.log("hello");
    res.status(201).json({
        message: "success",
    })
})

// get other user profile

exports.GetOtherUserData = asyncHandler(async (req, res) => {
    const { userid } = req.params
    const user = await User.findOne({ userid })
    res.status(201).json({
        message: "success",
        user
    })
})

/// user followers

exports.userFollowing = asyncHandler(async (req, res) => {
    const { userid, followerid } = req.params
    const user = await Users.findById(userid);
    const followUser = await Users.findById(followerid);

    if (!user || !followUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update following array for the current user
    if (!user.following.includes(followerid)) {
        user.following.push(followerid);
        await user.save();
    }

    // Update followers array for the user being followed
    if (!followUser.followers.includes(userid)) {
        followUser.followers.push(userid);
        await followUser.save();
    }
    res.status(200).json({ message: 'Successfully followed user' });
})


// unfollow user

exports.UnFollowUser = asyncHandler(async (req, res) => {
    const { userid, unfollowerid } = req.body

    const user = await Users.findById(userid);
    const unfollowUser = await Users.findById(unfollowerid); // Fix variable name here

    if (!user || !unfollowUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Remove unfollowUserId from the following array of the current user
    user.following = user.following.filter(id => id.toString() !== unfollowerid);
    await user.save();


    // Remove userId from the followers array of the user being unfollowed
    unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userid);
    await unfollowUser.save();

    res.status(200).json({ message: 'Successfully unfollowed user' });

})
// get following data

exports.getFollowing = asyncHandler(async (req, res) => {
    const { userid } = req.params
    const user = await Users.findById(userid).populate({
        path: 'following',
        select: 'name imgpath followers _id userid ', // Add fields you want to populate
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ following: user.following });
})

// get followers
exports.getFollowers = asyncHandler(async (req, res) => {

    const { userid } = req.params;
    const user = await Users.findById(userid).populate({
        path: 'followers',
        select: 'name imgpath followers _id userid', // Add fields you want to populate
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ followers: user.followers });

})



// get user contact details

exports.contactUsData = asyncHandler(async (req, res) => {
    const { name, email, subject, message,category } = req.body
    const contactUs = await contactUsModel.create(req.body)
    res.status(200).json({
        message: "Success"
    })
})

// report function 
exports.reportUser = asyncHandler(async (req, res) => {
    const { user, content } = req.body
    const report = await reportModel.create({ user, content })
    res.status(200).json({
        message: "success"
    })
})

// find user is present or not 

exports.FindUser = asyncHandler(async (req,res) => {
    const { userid } = req.params;
    const user = await User.findOne({ userid })
    if (!user) {
        return res.status(401).json({
            message: "User Not Present"
        })
    }

    res.status(201).json({
        message: "success"
    })
})