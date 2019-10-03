// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

const { validateBody, schemas } = require('../helpers/userRouteHelpers');
const { validateParam, paramSchemas } = require('../helpers/commonRouterHelper');
const usersController = require('../controllers/users');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
usersController.getUsers);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
usersController.getUser);

router.route('/create')
.post(validateBody(schemas.createUserSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
usersController.create);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateUserSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
usersController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
usersController.delete);

module.exports = router;