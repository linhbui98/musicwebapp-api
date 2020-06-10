const streamController = require('../controllers/streams.controller');
const router = require('express').Router()

// save record stream
router.post('/', streamController.record);

module.exports = router
