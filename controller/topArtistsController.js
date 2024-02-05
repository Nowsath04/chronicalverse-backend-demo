const asyncHandler = require("../middleware/trycatch");
const TopArtistModel = require("../models/topArtists");
const Users = require("../models/userModels");

exports.TopArtist = asyncHandler(async (req, res) => {

    // const artist = req.body.artist

    const user=await Users.findOne({userid:req.body.artist})
    const artist = await TopArtistModel.findOne({ Artist: user._id })
    if (artist) {
        const count = artist.counts
        const updateArtist = await TopArtistModel.findOneAndUpdate({ Artist: user._id }, { counts: count + 1 }, { new: true })
        return res.status(200).json({
            message: "success",
        })
    }

    const newArtist = await TopArtistModel.create({ Artist: user._id })
    return res.status(200).json({
        message: "new artists",
    })

})


exports.getTopArtists = asyncHandler(async (req, res) => {

    const allArtist = await TopArtistModel.find({}).sort({ counts: -1 }).limit(6).populate('Artist').exec();
    res.status(200).json({
         allArtist
    })
})