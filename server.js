const express =require("express")
const dotenv=require("dotenv").config()
const cors=require("cors")
const DbConnection = require("./config/ConnectDb")
const ErrorHandle=require("./middleware/error")
const userRouter=require("./router/UserRouter")
const cookieparser=require("cookie-parser")
const multer=require("multer")
const path=require("path");
const fs=require("fs")
const app=express()
const collectionRouter=require("./router/collectionRouter")
const singleCollectionRouter = require("./router/singleCollectionRouter")
const auctionRouter = require("./router/autionRouter")
const directSaleRouter = require("./router/singOrderRouter")
const bidRouter=require("./router/BidRouter")
const notificationRouter=require("./router/notificatonRouter")
const topArtists =require("./router/TopArtistsRouter")
const recommendedNft=require("./router/recommendedNftRouter")
// middleware
app.use(cookieparser())

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json())
app.use(userRouter)
app.use(collectionRouter)
app.use(singleCollectionRouter)
app.use(auctionRouter)
app.use(directSaleRouter)
app.use(bidRouter)
app.use(notificationRouter)
app.use(topArtists)
app.use(recommendedNft)

// connet mongoDb

DbConnection()

// setting port
const PORT=process.env.PORT || 5001

app.listen(PORT,()=>{
console.log(`setver running on ${PORT}`);
})


// error handler middleware

app.use(ErrorHandle)