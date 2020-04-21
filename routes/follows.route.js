var express = require('express');
var followController = require('../controllers/follows.controller');
var router = express.Router();

// get list follows
router.get('/', followController.findAll);

module.exports = router;