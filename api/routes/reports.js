// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

const { validateBody, schemas } = require('../helpers/userRouteHelpers');
const { validateParam, paramSchemas } = require('../helpers/commonRouterHelper');
const reportsController = require('../controllers/reports');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

// actual endpoints
router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.Manager, rolesList.User]),
reportsController.getCollectedAmountReport);

module.exports = router;