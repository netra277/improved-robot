// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

// const { validateBody, schemas } = require('../validators/userRouteHelpers');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');
const usersController = require('../controllers/users');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

// actual endpoints
router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
usersController.getUsers);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
usersController.getUser);

router.route('/create',usersController.create);
    
router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),usersController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
usersController.delete);

router.route('/:id/resetPassword')
.post(validateParam(paramSchemas.idSchema,'id'),usersController.resetPassword);

module.exports = router;