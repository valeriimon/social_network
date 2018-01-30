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
    role:{type:String, enum:["user", "admin", "manager"], default:"user"},
    age: Number,
    birthdayDate: {type:Date},
    gender: {type:String, enum:['male', 'female', "unknown"], default:"unknown"},
    address:Object, // example {country:"", city:"", street:""}
    telephone:String,
    email:String,
    avatars:{type: Array, default:['http://default.png']},
    interests: String,
    aboutMyself: String,
    groups: [
        {
            group: {type: Schema.Types.ObjectId, ref: "Group"},
            since: Date,
            confirm: {type:Boolean, default: false}
        }
    ],
    friends: [
        {
            friend: {type: Schema.Types.ObjectId, ref: "User"},
            since: Date,
            confirm: {type:Boolean, default: false},
            status: {type:String, enum:["recieve", "send"]}
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
        return true
    }
    return false
}

UserSchema.methods.getPassword = function(){
    let password = Utils.decryptValue(this.passSecure.encrypted);
    return password;
}

UserSchema.methods.getClear = function(){
   return _.omit(this.toObject(), ['passSecure'])
}





module.exports = mongoose.model('User', UserSchema);


