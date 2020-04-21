const singerController = require('../controllers/singers.controller');
const router = require('express').Router()


// get list singers
router.get('/', singerController.findAll);

module.exports = router