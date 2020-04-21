var express = require('express');
var authorController = require('../controllers/authors.controller');
var router = express.Router();

// get list authors
router.get('/', authorController.findAll);

module.exports = router;