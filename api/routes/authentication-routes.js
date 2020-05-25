const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

// const { validateBody, schemas } = require('../validators/userRouteHelpers');
const authController = require('../controllers/authenticationController');

router.route('/admin/login')
.post(passport.authenticate('StratAdmin',{session: false}),
    authController.loginAdmin);

router.route('/login')
.post(passport.authenticate('local'),
    authController.loginUser);

module.exports = router;