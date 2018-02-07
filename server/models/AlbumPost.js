const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      BaseModel = require("./BaseModel")
      


const AlbumPostSchema = BaseModel.extend(new Schema({
    image: String,
    body: String,
    album: {type: Schema.Types.ObjectId, ref: "Album"},
}))

UserSchema.methods.saveImages = async function(images, album){
    const mediaUsersDir = path.normalize(`${__dirname}/../../files/media/albums`);
    let imagesToSave = [];
    for(let image of images){
        let imgPath = `${mediaUsersDir}/album_id_${album}/post_id_${this._id}`;
        let name = path.basename(image);
        await Utils.rMkdir(imgPath);
        await Utils.copyFile(image, imgPath)
        imagesToSave.push(`media/albums/album_id_${album}/post_id_${this._id}/${name}`)
    }
    return imagesToSave;
}   
  


module.exports = mongoose.model('AlbumPost', AlbumPostSchema);