var express = require('express');
var userController = require('../controllers/users.controller');
var router = express.Router();

/* GET users listing. */
router.get('/', userController.info);

module.exports = router;
