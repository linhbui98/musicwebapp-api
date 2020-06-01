var express = require('express');
var genreController = require('../controllers/genres.controller');
var router = express.Router();

// get list genres
router.get('/', genreController.findAll);

module.exports = router;