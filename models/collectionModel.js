const mongoose = require('mongoose')

const CollectionSchema = mongoose.Schema({
    collectiontitle: {
        type: String,
        required: true
    },
    collectionurl: {
        type: String,
        required: true
    },
    collectiondescription: {
        type: String,
        required: true
    },
    collectionIpfsValue: {
        type: String,
        required: true
    },
    collectionCreater: {
        type: String,
    }
}, {
    timestamps: true,
})

const collectionModel = mongoose.model("Collections", CollectionSchema)

module.exports = collectionModel;
