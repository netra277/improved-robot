const router = require('express-promise-router')();
const adminUsersController = require('../controllers/adminController');

// actual endpoints
router.route('/changePassword')
.post(adminUsersController.changeAdminPassword);

module.exports = router;