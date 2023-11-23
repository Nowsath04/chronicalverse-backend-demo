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

// middleware
app.use(cookieparser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json())
app.use(userRouter)
app.use(collectionRouter)


// connet mongoDb

DbConnection()

// setting port
const PORT=process.env.PORT || 5001

app.listen(PORT,()=>{
console.log(`setver running on ${PORT}`);
})


// error handler middleware

app.use(ErrorHandle)