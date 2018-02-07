"use strick"
const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel"),
      crypto = require("crypto"),
      path = require("path"),
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
    avatars:{type: Array, default:[{isActive:true, url:'media/users/default.png'}]},
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
            visits: Number,
            confirm: {type:Boolean, default: false},
            status: {type:String, enum:["recieve", "send"]}
        }
    ]
}))





UserSchema.methods.create = async function(body){
    let result = Utils.secureValue(body.password);
    this.passSecure = result;
    if(body.hasOwnProperty("avatar")){
        let image = await this.saveImages(body.avatar);
        body.avatars.push({url:image, isActive:false})        
    }
    Object.assign(this, body);
    await this.save()
    return this;
}

UserSchema.methods.saveImages = async function(images){
    const mediaUsersDir = path.normalize(`${__dirname}/../../files/media/users`);
    let imgPath = `${mediaUsersDir}/user_id_${this._id.toString()}/avatars`;
    let name = path.basename(images);
    await Utils.rMkdir(imgPath);
    await Utils.copyFile(images, imgPath);
    return `media/users/user_id_${this._id.toString()}/avatars/${name}`;
}

UserSchema.methods.getFriends = async function(page, perpage, filter = {}){
    // filter fields: fullname(firstname, lastname), age, country, city, gender,
    function regExpByVarType (data, flags){
        switch (typeof data) {
            case 'string' : return new RegExp(data, flags); break;
            case 'number' : return data; break;
        }
    }
    let $match = {};
    let confirm = filter.confirm;
    delete filter.confirm;
    for(let key in filter){
        if(key == 'fullname'){
            let [first, last] = filter[key].split(' ');
            let fullnameArray = [{firstname: RegExp(first, 'i')}, {lastname: RegExp(last? last : first, 'i')}]; 
            if(first && last) {
                $match.$and = fullnameArray;
            } else if(first) {
                $match.$or = fullnameArray;
            }
        } 
        else {
            $match[key] = regExpByVarType(filter[key], 'i'); 
        }
    }
    
    

    let response = await this.aggregate([
        {$unwind:{path: '$friends'}},
        {$match: {'$friends.confirm': confirm}},
        {$lookup: {from: 'users', localField: 'friends.friend', foreignField: '_id', as: 'friends.friend'}},
        {$group: {_id: null, friends: {$push: '$friends.friend'}}},
        {$replaceRoot: { newRoot: '$friends'}},
        {$match},
        {$project: {friends: {$slice: ['$$ROOT', page, perpage] }, totalCount: {$size: '$$ROOT'}}}
    ])

    return response;
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


