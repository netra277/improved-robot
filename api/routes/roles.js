const router = require('express-promise-router')();

const rolesController = require('../controllers/roles');

router.route('/')
.get(rolesController.getRoles);

module.exports = router;