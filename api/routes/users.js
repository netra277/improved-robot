// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

const { validateBody, schemas } = require('../helpers/userRouteHelpers');
const usersController = require('../controllers/users');



// router.route('/signUp')
// .post(validateBody(schemas.authSchema), usersController.signUp);

// router.route('/login')
// .post(validateBody(schemas.authSchema),passport.authenticate('local',{session:false}), usersController.login);

router.route('/login')
.post(validateBody(schemas.authSchema),passport.authenticate('local',{session:false}), usersController.login);

router.route('/create')
.post(validateBody(schemas.createUserSchema),passport.authenticate('local',{session:false}), usersController.createUser);

router.route('/getUser')
.get(passport.authenticate('jwt',{session:false}),usersController.getUser);
// router.route('/secret')
// .get(passport.authenticate('jwt',{session:false}), usersController.secret);

module.exports = router;