var multer = require('multer');
const path =require('path')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, './uploads/musics');
       
    },
    filename: (req, file, callback) => {
      let math = ["audio/mp3", "audio/mp4", "audio/mpeg"];
      if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
        return callback(errorMess, null);
      }
      let filename = `${Date.now()}-${file.originalname}`;
      callback(null, filename);
}})

var upload = multer({storage:storage});

module.exports = upload;