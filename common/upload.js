var multer = require('multer');
var path = require('path');

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
      const fileExtName = path.extname(file.originalname);
      const randomName = Array(10)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
      let filename = `${Date.now()}-${randomName}${fileExtName}`;
      cb(null, filename);
}})

var upload = multer({storage:storage});

module.exports = upload;
