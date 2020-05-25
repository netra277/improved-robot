// const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

// const { validateBody, schemas } = require('../validators/userRouteHelpers');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');
const reportsController = require('../controllers/reportsController');
const authController = require('../controllers/authenticationController');

// actual endpoints
router.route('/')
.get(reportsController.getCollectedAmountReport);

module.exports = router;