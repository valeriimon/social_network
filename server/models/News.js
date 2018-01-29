const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const NewsSchema = BaseModel.extend(new Schema({
    newsType: {type:String, enum:["human's wall", "group"]},
    athour: {type:Schema.Types.ObjectId, ref:"User", required: true},
    refTo:{
        wall: {type: Schema.Types.ObjectId, ref: "User"},
        group: {type: Schema.Types.ObjectId, ref: "Group"}
    },
    body: String,
    images: {type: Array, default: []},
}))




module.exports = mongoose.model('News', NewsSchema);
