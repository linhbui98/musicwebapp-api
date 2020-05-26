const userController = require('../controllers/users.controller');
const router = require('express').Router()


// get list users
router.get('/', userController.findAll);
// get user by id
router.get('/:username', userController.findByUsername);
// get profile
router.get('/profile', userController.getProfile);
// create user
// router.post('/', userController.createUser);
// update user
router.put('/', userController.updateUser);
// change avatar
router.put('/changeAvatar', userController.changeAvatar);
// delete user
router.put('/inactive', userController.inactiveUser);
// reactive user
router.put('/reactive', userController.reactiveUser);
// delete user forever
router.delete('/', userController.deleteUserForever);

module.exports = router
