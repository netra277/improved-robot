const express = require('express');
const router = require('express-promise-router')();

const {validateBody, schemas} = require('../helpers/routeHelpers');
const usersController = require('../controllers/users');

router.route('/signUp')
.post(validateBody(schemas.authSchema), usersController.signUp);

router.route('/signIn')
.post(usersController.signIn);

router.route('/secret')
.post(usersController.secret);

module.exports = router;