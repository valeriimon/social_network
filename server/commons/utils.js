const fs = require("fs"),
      path = require("path"),
      crypto = require("crypto"),
      pathToMedia = path.normalize(`${__dirname}../../files/media`),
      cipterAlgorithm = 'aes-256-cbc',
      hmacMethod = 'sha256',
      salt = '1v4a7l0e5r6a';

export default class Utils{
    static async copyFile(oldpath, newpath){
        return new Promise((resolv,reject)=>{
          var cbCalled = false;
          try{
            var rd = fs.createReadStream(oldpath);
            rd.on("error", function(err) {
              done(err);
            });
            var wr = fs.createWriteStream(newpath);
            wr.on("error", function(err) {
              done(err);
            });
            wr.on("close", function(ex) {
              done();
            });
            rd.pipe(wr);
          } catch (err){return reject(err);}
          function done(err) {
            if (!cbCalled) {
              if(err){
                reject(err);
              } else {
                resolv()
              }
              cbCalled = true;
            }
          }
        })
      }

    static async mkDir(path){
        return new Promise((resolve, reject)=>{
            fs.mkdir(path, err=>{
                if(err){
                    return reject(err)
                }
                resolve()
            })
        })
    }

    static decryptValue(encriptText){
        var decipher = crypto.createDecipher(cipterAlgorithm, salt)
        var dec = decipher.update(encriptText,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;

    }

    static secureValue(value){
        const cipher = crypto.createCipher(cipterAlgorithm, salt);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const hash = crypto.createHmac(hmacMethod, salt)
        .update(value)
        .digest('hex')
        return {encrypted, hash}
    }

    static async rMkdir(dirPath){
        let endPath = '/';
        const parts = dirPath.split('/');
        for(let part of parts){
          endPath += part + '/';
          if(!await this.pathExist(endPath)){
            await this.mkdir(endPath)
          }
        }
      }

    static async pathExist(dirPath){
        return new Promise((resolv,reject)=>{
          fs.access(dirPath, (err)=>{
            if(err) return resolv(false)
            resolv(true);
          })
        });
    }

    
    static async removeFile(path){
        return new Promise((resolv,reject)=>{
          return fs.unlink(path, function(err) {
            return resolv(err);
          });
        });
    }
}