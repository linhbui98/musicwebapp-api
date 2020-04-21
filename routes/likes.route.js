var express = require('express');
var likeController = require('../controllers/likes.controller');
var router = express.Router();

// get list likes
router.get('/', likeController.findAll);

module.exports = router;