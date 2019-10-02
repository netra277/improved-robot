const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

const { validateBody, schemas } = require('../helpers/userRouteHelpers');
const authController = require('../controllers/authentication');

router.route('/login')
.post(
    validateBody(schemas.authSchema),
    passport.authenticate('local',{session:false}),
    authController.login);

module.exports = router;