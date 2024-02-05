const express = require("express")
const { TopArtist, getTopArtists } = require("../controller/topArtistsController")

const router = express.Router()

router.post("/topartists",TopArtist)
router.get("/get_topartists",getTopArtists)

module.exports=router