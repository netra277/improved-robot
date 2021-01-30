const router = require('express-promise-router')();

const authController = require('../controllers/authenticationController');
const adminUsersController = require('../controllers/adminController');
const rolesController = require('../controllers/rolesController');

// actual endpoints

// roles endpoint
// router.route('/:id')
// .put(validateParam(paramSchemas.idSchema,'id'),
// validateBody(schemas.updateRoleSchema),
// passport.authenticate('jwt',{session:false}),
// authController.roleAuthorization([]),
// rolesController.update);

router.route('/role/create')
.post(rolesController.create);

router.route('/role/:id')
.put(rolesController.update);

router.route('/role/:id')
.delete(adminUsersController.changeAdminPassword);

// client endpoints
router.route('/client/create')
.post(adminUsersController.changeAdminPassword);

router.route('/role/update/:id')
.post(adminUsersController.changeAdminPassword);

router.route('/role/delete/:id')
.post(adminUsersController.changeAdminPassword);

//admin User endpoints
router.route('/client/create')
.post(adminUsersController.changeAdminPassword);

router.route('/role/update/:id')
.post(adminUsersController.changeAdminPassword);

router.route('/role/delete/:id')
.post(adminUsersController.changeAdminPassword);

// Discount type endpoints



module.exports = router;