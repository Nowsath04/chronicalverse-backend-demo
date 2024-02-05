const mongoose = require("mongoose")

const TopArtistsSchema = new mongoose.Schema({
    Artist: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    counts: {
        type: Number,
        default: 1
    }
})


const TopArtistModel=mongoose.model("topArtists",TopArtistsSchema)
module.exports=TopArtistModel