const asyncHandler = require("../middleware/trycatch");
const nftSchemaModel = require("../models/SingleCollectionModel");
const singleCollectionModel = require("../models/SingleCollectionModel");
const ErrorHandler = require("../utils/ErrorHandler");
const AWS = require("aws-sdk")
const fs = require("fs");
const Users = require("../models/userModels");
const APIFeatures = require("../utils/apiFeatures");
const collectionModel = require("../models/collectionModel");
const nftOwnerModel = require("../models/nftOwner");
const TopArtistModel = require("../models/topArtists");


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
    const { collection_id, nft_token, nft_name, nft_owner, image_hash, nfthashvalue, nft_date, nft_description, nft_additionalDetails, nft_itemsdetails, nft_creator, pathname, type } = req.body
    const imagePath = req.file.path
    const userImage = fs.readFileSync(imagePath)
    let data = await uploadToS3(userImage);
    const nftData = await nftSchemaModel.create({
        collection_id: collection_id,
        nfttoken: nft_token,
        nft_name: nft_name,
        nft_owner: nft_owner,
        nftCreator: nft_owner,
        imgIpfsValue: image_hash,
        nftIpfsValue: nfthashvalue,
        nft_date: nft_date,
        nft_description: nft_description,
        nft_additionalDetails: nft_additionalDetails,
        nft_itemsdetails: nft_itemsdetails,
        nftCreator: nft_creator,
        image: data,
        pathname: pathname,
        type: type
    })
    res.status(200).json({
        message: "success",
        nftData
    })
})



exports.nftAllData = asyncHandler(async (req, res, next) => {
    try {
        const apiFeatures = new APIFeatures(nftSchemaModel.find({ nftOnsale: true }).sort({ _id: -1 }), req.query).search()
        const allData = await apiFeatures.query;
        res.status(200).json({ data: allData });
    } catch (error) {
        console.log("Error fetching all data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


exports.getNFT = async (req, res) => {

    const { id, token, collectionId } = req.params
    try {
        const data = await nftSchemaModel.findOne({
            nftIpfsValue: id,
            nfttoken: token,
            collection_id: collectionId
        });
        res.status(200).json({ message: "success", data });
    } catch (error) {
        console.log(error);
    }
}


// update nft

exports.UpdateNft = asyncHandler(async (req, res) => {
    const nfttoken = req.params.tokenid;
    const collection_id = req.params.collectionId;
    const updateNft = await nftSchemaModel.findOneAndUpdate(
        { nfttoken, collection_id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!updateNft) {
        return res.status(404).json({ success: false, error: 'NFT not found' });
    }

    res.status(200).json({ success: true, data: updateNft });
})

// get user nft
exports.getUserNft = asyncHandler(async (req, res) => {
    const id = req.params.userid
    const getnft = await nftSchemaModel.find({ nft_owner: id }).sort({ _id: -1 })
    res.status(200).json({
        message: "success",
        getnft
    })
})

// get  user sale nft
exports.getUserSaleNft = asyncHandler(async (req, res) => {
    const id = req.params.userid
    const getnft = await nftSchemaModel.find({ nft_owner: id, nftOnsale: true }).sort({ _id: -1 })
    res.status(200).json({
        message: "success",
        getnft
    })
})
//get particular user created nft
exports.getUserCreatedNft = asyncHandler(async (req, res) => {
    const id = req.params.userid
    const getnft = await nftSchemaModel.find({ nftCreator: id }).sort({ _id: -1 })
    res.status(200).json({
        message: "success",
        getnft
    })
})


exports.userLikeNft = asyncHandler(async (req, res) => {

    const { id, userid } = req.params;
    const user = await Users.findById(userid);

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    const likedNft = user.likednft || [];

    if (likedNft.includes(id)) {
        // If the NFT is already liked, remove it
        user.likednft = likedNft.filter(nftId => nftId.toString() !== id.toString());
        await user.save();
        await user.populate('likednft') // Move this line here
        res.status(201).json({
            message: "successfully removed"
        });
    } else {
        // If the NFT is not liked, add it
        user.likednft.push(id);
        await user.save();
        await user.populate('likednft') // Move this line here
        res.status(201).json({
            message: "successfully added"
        });
    }


    // Populate the 'likednft' field after saving to get the updated data

})

exports.getUserFavorites = asyncHandler(async (req, res) => {
    const { userid } = req.params;
    const user = await Users.findById(userid);


    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const likedNftIds = user.likednft;
    if (!likedNftIds || likedNftIds.length === 0) {
        return res.status(200).json({ success: true, data: [] });
    }

    const likedNft = await nftSchemaModel.find({ _id: { $in: likedNftIds } }).populate("user").exec();

    if (!likedNft) {
        return res.status(404).json({ error: "Liked NFTs not found" });
    }
    res.status(200).json({
        likedNft
    })


})


// get hot collection 

exports.GetHotCollection = asyncHandler(async (req, res) => {
    function filterByFrequency(arr, property) {

        const counts = arr.reduce((acc, obj) => {
            const value = obj[property];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
        const sortedValues = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        return sortedValues;
    }
    const allNft = await nftSchemaModel.find()
    const data1 = filterByFrequency(allNft, "collection_id")
    let topCollection = []
    await Promise.all(data1.map(async (data) => {
        let lastDocument = await nftSchemaModel
            .findOne({ collection_id: data })
            .sort({ _id: -1 })
            .limit(1);
        let documentCount = await nftSchemaModel.countDocuments({ collection_id: data });
        let collectionName = await collectionModel.findOne({ collection_id: data })

        topCollection.push({ lastDocument, documentCount });
        topCollection.sort((a, b) => b.documentCount - a.documentCount);
        topCollection = topCollection.slice(0, 5);

    }));
    res.status(200).json({
        message: "success",
        topCollection


    })
})

// get single collection nft 

exports.GetSingleCollectionNft = asyncHandler(async (req, res) => {
    const { collection_id } = req.params
    const apiFeatures = new APIFeatures(nftSchemaModel.find({ collection_id: collection_id, nftOnsale: true }).sort({ _id: -1 }), req.query).search();
    const getallNft = await apiFeatures.query;
    res.status(200).json({
        message: "success",
        getallNft
    })

})


exports.NftOwner = asyncHandler(async (req, res) => {

    const { ownerAddress, tokenId, collectionId } = req.body.data
    const findOwnerId = await Users.findOne({ userid: ownerAddress })
    const newOwner = await nftOwnerModel.create({ owner: findOwnerId._id, tokenId, collectionId })
    res.status(200).json({
        message: "success"
    })

})

exports.getNftOwner = asyncHandler(async (req, res) => {
    const { tokenId, collectionId } = req.params
    const getallOwner = await nftOwnerModel.find({ tokenId: tokenId, collectionId: collectionId }).populate("owner")
    res.status(200).json({
        message: "success",
        getallOwner
    })
})


// get all collection count , user count ,

exports.getCount = asyncHandler(async (req, res) => {
    const allArtist = await TopArtistModel.find({}).sort({ counts: -1 }).exec();
    const topArtist = allArtist.length


    const user = await Users.find({})
    const alluser = user.length
    const totalNft = (await nftSchemaModel.find({})).length

    res.status(200).json({
        message: "success",
        topArtist,alluser,totalNft
    })
})

exports.DeleteSingleNFT=asyncHandler(async(req,res)=>{
    const { token, collectionId } = req.params
    const deleteNft=await nftSchemaModel.findOneAndDelete({ nfttoken: token, collection_id: collectionId })
    res.status(200).json({
        message: "success",
        
    })
})