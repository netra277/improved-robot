// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');
const rolesObj = require('../constants/enums').Roles;

const usersController = require('../controllers/usersController');
const authController = require('../controllers/authenticationController');

// actual endpoints
router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
usersController.getUsers);

router.route('/:id')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN, rolesObj.MANAGER, rolesObj.STORE_SUPERVISOR, rolesObj.USER]),
usersController.getUser);

router.route('/').post(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
usersController.create);
    
router.route('/:id')
.put(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
usersController.update);

router.route('/:id')
.delete(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
usersController.delete);

router.route('/:id/resetPassword')
.post(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
usersController.resetPassword);

module.exports = router;