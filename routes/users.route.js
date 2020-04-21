const userController = require('../controllers/users.controller');
const router = require('express').Router()


// get list users
router.get('/', userController.findAll);

module.exports = router
