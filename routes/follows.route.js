var express = require('express');
var followController = require('../controllers/follows.controller');
var router = express.Router();

// get list follows
router.get('/', followController.findAll);

// create follows
router.post('/', followController.createFollow);

// delete follows
router.delete('/:id', followController.deleteFollow);

module.exports = router;