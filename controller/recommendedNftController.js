const asyncHandler = require("../middleware/trycatch");
const nftSchemaModel = require("../models/SingleCollectionModel");
const recommendedModel = require("../models/recommended");


exports.RecommendedNft = asyncHandler(async (req, res) => {
    const { user, collection_id } = req.body

    const recommendedNftFind = await recommendedModel.findOne({ user: user, collection_id: collection_id })

    if (recommendedNftFind) {
        const count = recommendedNftFind.counts
        const recommendedNftFinds = await recommendedModel.findOneAndUpdate({ user: user, collection_id: collection_id }, { counts: count + 1 }, { new: true })
        return res.status(200).json({
            message: "success old"
        })
    }

    const recommendedNft = await recommendedModel.create({ user: user, collection_id: collection_id })
    res.status(200).json({
        message: "successs"
    })

})

exports.getUserRecommendedNft = asyncHandler(async (req, res) => {
    const { user_id } = req.params
    const distinctCollectionIds = await recommendedModel.find({ user: user_id }).sort({ collection_id: -1 }).limit(5);
    const collecionId = distinctCollectionIds.map(data => data.collection_id)

    const allnft = await Promise.all(
        collecionId.map(async (collectionid) => {
            return await nftSchemaModel.find({ collection_id: collectionid }).sort({ collection_id: -1 })
        })
    )
    const concatenatedArray = allnft.flat()
    const newnft = concatenatedArray.filter((data) => data.nftOnsale !== false)
    const data = newnft.filter((nft) => nft.nft_owner !== user_id)
    const finaldata = data.splice(0, 8)
    res.status(200).json({
        finaldata
    })
})