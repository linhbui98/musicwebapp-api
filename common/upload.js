var multer = require('multer');
const path =require('path')
var storage = multer.diskStorage({
    destination: (req, file, cb) => {

      let photos = ["image/png", "image/jpeg"];
      if (photos.indexOf(file.mimetype) !== -1)  {
        cb(null, `./uploads/photos`);
      }

      let audios = ["audio/mp3", "audio/mp4", "audio/mpeg"];
      if (audios.indexOf(file.mimetype) !== -1)  {
        cb(null, `./uploads/audios`);
      }
       
    },
    filename: (req, file, cb) => {

      let match = ["image/png", "image/jpeg", "audio/mp3", "audio/mp4", "audio/mpeg"];
      if (match.indexOf(file.mimetype) === -1) {
        let errorMess = `The file ${file.originalname} is invalid. Only allowed to upload image jpeg or png or mpeg.`;
        return cb(errorMess, null);
      }

      let filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
}})

var upload = multer({storage:storage});

module.exports = upload;
