const userController = require('../controllers/users.controller');
const router = require('express').Router()


// get list users
router.get('/', userController.findAll);
// get user by id
router.get('/:id', userController.findById);
// create user
router.post('/', userController.createUser);
// update user
router.put('/:id', userController.updateUser);
// delete user
router.delete('/:id', userController.deleteUser);

module.exports = router
