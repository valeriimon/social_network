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


UserSchema.methods.saveImages = async function(images){
    const mediaUsersDir = path.normalize(`${__dirname}/../../files/media/albums`);
    let imgPath = `${mediaUsersDir}/album_id_${this._id.toString()}/avatars`;
    let name = path.basename(images);
    await Utils.rMkdir(imgPath);
    await Utils.copyFile(images, imgPath);
    return `media/albums/album_id_${this._id.toString()}/avatars/${name}`;
}

module.exports = mongoose.model('Album', AlbumSchema);