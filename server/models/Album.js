const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const AlbumSchema = BaseModel.extend(new Schema({
    coverImage: String,
    name: String,
    description: String,
    dateCreated:{type:Date, default:Date.now()},
    refTo: {
        user: {type: Schema.Types.ObjectId, ref: "User"},
        //or
        group: {type: Schema.Types.ObjectId, ref: "Group"}
    }
}))




module.exports = mongoose.model('Album', AlbumSchema);