const router = require('express-promise-router')();
const adminUsersController = require('../controllers/adminUserController');

// actual endpoints
router.route('/user')
.post(adminUsersController.createAdminUser);


module.exports = router;