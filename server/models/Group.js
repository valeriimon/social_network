const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const GroupSchema = BaseModel.extend(new Schema({
    name: {type: String, required: true},
    members: Number,
    author: {type: Schema.Types.ObjectId, ref:"User"},
    description: String,
    images: {type: Array, default: []} 
}))




module.exports = mongoose.model('Group', GroupSchema);