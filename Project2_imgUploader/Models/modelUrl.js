import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    filename: String,
    public_Id: String,
    imgUrl: String,

})

export const File = mongoose.model("image", imageSchema)
