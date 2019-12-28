var express = require('express');
var router = express.Router();
var userController = require('../controllers/UsersController.js');

router.get('/register', userController.addUserGet);
router.post('/register', userController.addUserPost);
router.get('/login', userController.loginUserGet);
router.post('/login', userController.loginUserPost);
router.get('/logout', userController.logout);
router.get('/dashboard', userController.usersDashboard);
router.get('/mytournaments', userController.myTournaments);
router.get('/userlist', userController.userlist);
router.get('/admin', userController.adminPanel);
router.post('/admin', userController.adminPanelPost);
module.exports = router;
