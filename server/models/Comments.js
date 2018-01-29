const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const CommentSchema = BaseModel.extend(new Schema({
    author: {type:Schema.Types.ObjectId, ref:"User"},
    body: String,
    commentType:{type: String, enum: ["news", "albumPost"]},
    refTo: {
        news: {type: Schema.Types.ObjectId, ref: "News"},
        albumPost: {type: Schema.Types.ObjectId, ref: "AlbumPost"}
    }   
}))




module.exports = mongoose.model('Comment', CommentSchema);