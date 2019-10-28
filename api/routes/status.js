const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');
 
const statusController = require('../controllers/status');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

// actual endpoints
router.route('/user')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
statusController.getUserStatus);

router.route('/client')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser]),
statusController.getClientStatus);

module.exports = router;