// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

// const { validateBody, schemas } = require('../validators/userRouteHelpers');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authenticationController');

// actual endpoints
router.route('/')
.get(usersController.getUsers);

router.route('/:id')
.get(usersController.getUser);

router.route('/create',usersController.create);
    
router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),usersController.update);

router.route('/:id')
.delete(usersController.delete);

router.route('/:id/resetPassword')
.post(usersController.resetPassword);

module.exports = router;