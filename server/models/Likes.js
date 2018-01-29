const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const LikeSchema = BaseModel.extend(new Schema({
    author: {type:Schema.Types.ObjectId, ref:"User"},
    likeType: {type: String, enum: ["comment", "news", "albumPost"], required: true}, 
    refTo: {
        comment: {type: Schema.Types.ObjectId, ref: "Comment"},
        news: {type: Schema.Types.ObjectId, ref: "News"},
        albumPost: {type: Schema.Types.ObjectId, ref: "AlbumPost"}
    }
}))




module.exports = mongoose.model('Like', LikeSchema);