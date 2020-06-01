var express = require('express');
var searchController = require('../controllers/searchs.controller.js');
var router = express.Router();

router.get('/', searchController.searchUsers);

module.exports = router;