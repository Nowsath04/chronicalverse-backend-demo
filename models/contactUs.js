const mongoose = require("mongoose")

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    subject: {
        type: String,

    }, 
     category: {
        type: String,
    },
    message: {
        type: String,
        require: true
    },


}, {
    timestamps: true
})


const contactUsModel=mongoose.model("contactUs",contactUsSchema)

module.exports =contactUsModel