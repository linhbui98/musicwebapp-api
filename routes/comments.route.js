var express = require('express');
var commentController = require('../controllers/comments.controller');
var router = express.Router();

// get list comments
router.get('/', commentController.findAll);

module.exports = router;