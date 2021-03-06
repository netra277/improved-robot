const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

// const { validateBody, schemas } = require('../validators/userRouteHelpers');
const authController = require('../controllers/authenticationController');

router.route('/admin/login')
.post(passport.authenticate('StratLoginAdmin',{session: false}),
    authController.loginAdmin);

router.route('/user/login')
.post(passport.authenticate('StratLoginUser',{session: false}),
    authController.loginUser);

module.exports = router;