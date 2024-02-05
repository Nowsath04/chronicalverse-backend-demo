const mongoose = require("mongoose")

const Notification = mongoose.Schema({
    notifyTo: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    Distillery: {
        type: String,
    },
    img: {
        type: String
    },
    bidprice: {
        type: String,
    },
    burnTokenName: {
        type: String,
    },
    notificationType: {
        type: String,
    },
    pathname: {
        type: String,
    },
    viewed: {
        default: false,
        type: Boolean
    },
    created_at: { type: Date, required: true, default: Date.now }

})

const Notifications = mongoose.model("Notify", Notification)

module.exports = Notifications