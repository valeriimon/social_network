const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const MessageSchema = BaseModel.extend(new Schema({
     chatId: String  
}))




module.exports = mongoose.model('Comment', CommentSchema);