var express = require('express');
var shareController = require('../controllers/shares.controller.js');
var router = express.Router();

router.post('/', shareController.createShare);

module.exports = router;