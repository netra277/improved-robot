const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');
 
const statusController = require('../controllers/statusController');
const authController = require('../controllers/authenticationController');

// actual endpoints
router.route('/user')
.get(statusController.getUserStatus);

router.route('/client')
.get(statusController.getClientStatus);

module.exports = router;