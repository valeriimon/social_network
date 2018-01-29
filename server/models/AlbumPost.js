const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const AlbumPostSchema = BaseModel.extend(new Schema({
    image: String,
    body: String,
    albumName: String,
    refTo: {
        user: {type: Schema.Types.ObjectId, ref: "User"},
        group: {type: Schema.Types.ObjectId, ref: "Group"}
    } 
}))




module.exports = mongoose.model('AlbumPost', AlbumPostSchema);