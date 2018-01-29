"use strick"
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel"),
      crypto = require("crypto"),
      _ = require("lodash"),
      salt = '1v4a7l0e5r6a';
      

import Utils from '../commons/utils';


const UserSchema = BaseModel.extend(new Schema({
    firstname: {type:String, required: true},
    lastname: String,
    passSecure:{type:Object, required: true},
    age: Number,
    birthdayDate: {type:Date},
    gender: {type:Array, enum:['male', 'female']},
    address:Object, // example {country:"", city:"", street:""}
    interests: String,
    aboutMyself: String,
    groups: [
        {
            group: {type: Schema.Types.ObjectId, ref: "Group"},
            since: Date
        }
    ],
    friends: [
        {
            friend: {type: Schema.Types.ObjectId, ref: "User"},
            since: Date
        }
    ]
}))




UserSchema.methods.create = async function(body){
    let result = Utils.secureValue(body.password);
    this.passSecure = result;
    Object.assign(this, body);
    await this.save()
    return this;
}

UserSchema.methods.comparePassword = function(password){
    const hash = crypto.createHmac('sha256', salt)
        .update(password)
        .digest("hex")
    
    if(hash == this.passSecure.hash){
        return false
    }
    return true
}





module.exports = mongoose.model('User', UserSchema);


