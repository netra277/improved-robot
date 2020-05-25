const router = require('express-promise-router')();
const adminUsersController = require('../controllers/adminUserController');

// actual endpoints
router.route('/user')
.post(adminUsersController.createAdminUser);

router.route('/activateAdmin')
.put(adminUsersController.activateClient);

module.exports = router;