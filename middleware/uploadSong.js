const upload = require('../common/upload');

module.exports = async (req, res, next) => {
  try {
    // await upload.single('file')
    console.log(req.body.file)
    res.locals.song = req.file;
    next()
  } catch (error) {
    return res.send(`Error when trying to upload: ${error}`);
  }
}
