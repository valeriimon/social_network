const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const AlbumPostSchema = BaseModel.extend(new Schema({
    image: String,
    body: String,
    album: {type: Schema.Types.ObjectId, ref: "Album"},
}))




module.exports = mongoose.model('AlbumPost', AlbumPostSchema);