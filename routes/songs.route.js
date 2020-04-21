var express = require('express');
var songController = require('../controllers/songs.controller');
var router = express.Router();

// get list songs
router.get('/', songController.findAll);

module.exports = router;