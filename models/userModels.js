
const mongoose = require("mongoose")

const UserShema = mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  nonce: String,
  name: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  imgpath: {
    type: String,
  },
  coverimg: {
    type: String,
  },
  stripeCustomerId: {
    type: String,
    trim: true,
    default: null,
  },
  whiteListUser:{
    type:Boolean,
    default: false,


  }
},
  {
    timestamps: true,
  }
)

const Users = mongoose.model("Users", UserShema)

module.exports = Users