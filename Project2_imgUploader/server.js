import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import path from "path"
import { File } from "./Models/modelUrl.js"

import { v2 as cloudinary } from 'cloudinary';
  // Configuration
  cloudinary.config({ 
    cloud_name: 'CLOUDINARY_CLOUD_NAME', 
    api_key: 'CLOUDINARY_API_KEY', 
    api_secret: 'CLOUDINARY_API_SECRET'
});

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect("MONGO_URI",{
    dbName:"nodeJs1"})
    .then(()=>{console.log("Connected to Mongo database")})
    .catch((err)=>{console.log(err)});

// rendering ejs file
app.get('/', (req,res) => {
    res.render("index.ejs",{url: null});
})

const storage = multer.diskStorage({  // copied from multer website
    destination: "./public/uploads",
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname)
      cb(null, file.fieldname + "-" + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), async(req, res) => {  // copied from multer website
    const file = req.file.path

    // uploading file on cloudinary
    const cloudinaryRes = await cloudinary.uploader.upload(file,{
        folder:"cloudinary_Images"
    })

    // saving file in database
    const db = await File.create({
        filename: file.originalname,
        public_Id: cloudinaryRes.public_id,
        imgUrl: cloudinaryRes.secure_url
    })
    res.render("index.ejs",{url: cloudinaryRes.secure_url});
    
    // res.json({message:"File Uploaded Successfully",cloudinaryRes})
    
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })



const port = 8000
app.listen(port, () => {console.log(`Server running on port ${port}`)})

// we have installed multer and cloudinary (npm i multer, npm i cloudinary)
// = cloudinary is a cloud service that offers a solution to a web application's entire image management pipeline.
// it stores images in the cloud and serves them to users through a fast content delivery network (CDN).
// = multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.