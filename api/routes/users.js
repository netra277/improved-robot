const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

const {validateBody, schemas} = require('../helpers/routeHelpers');
const usersController = require('../controllers/users');

router.route('/signUp')
.post(validateBody(schemas.authSchema), usersController.signUp);

router.route('/signIn')
.post(validateBody(schemas.authSchema),passport.authenticate('local',{session:false}), usersController.signIn);

router.route('/secret')
.get(passport.authenticate('jwt',{session:false}), usersController.secret);

module.exports = router;