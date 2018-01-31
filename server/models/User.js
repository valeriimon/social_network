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
            confirm: {type:Boolean, default: false},
            status: {type:String, enum:["recieve", "send"]}
        }
    ]
}))





UserSchema.methods.create = async function(body){
    let result = Utils.secureValue(body.password);
    this.passSecure = result;
    if(body.hasOwnProperty("avatar")){
        let image = await this.saveImages(body.avatar, 'avatar');
        body.avatars.push({url:image, isActive:false})        
    }
    if(body.hasOwnProperty())
    
    Object.assign(this, body);
    await this.save()
    return this;
}

UserSchema.methods.saveImages = async function(images, flag){
    /**
     * flag example:
     *  avatar (save user avatar's image)
     *  album  (save album's images, flag should be an object type {flag:album, name:albumName} and images as an array of strings(url))
     *  
     */
    const mediaUsersDir = path.normalize(`${__dirname}/../../files/media/users`);
    if(flag && images.length){
        if(flag == 'avatar' && typeof images == 'string'){
            let imgPath = `${mediaUsersDir}/user_id_${this._id.toString()}/avatars`;
            let name = path.basename(images);
            await Utils.rMkdir(imgPath);
            await Utils.copyFile(images, imgPath);
            return `media/users/user_id_${this._id.toString()}/${name}`;
        }
        else if(flag == 'album' && typeof images == 'object'){
            let imagesToSave = [];
            for(let image of images){
                let imgPath = `${mediaUsersDir}/user_id_${this._id.toString()}/album/${flag.name}`;
                let name = path.basename(image);
                await Utils.rMkdir(imgPath);
                await Utils.copyFile(image, imgPath)
                imagesToSave.push(`media/users/user_id_${this.id.toString()}/album/${flag.name}/${name}`)
            }
            return imagesToSave;
        }   
    }
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


