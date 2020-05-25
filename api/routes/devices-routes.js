const router = require('express-promise-router')();
const passport = require('passport');
//const { validateBody, schemas } = require('../validators/roleRouteHelper');
//const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');
const rolesObj = require('../constants/enums').Roles;

const devicesController = require('../controllers/devicesController');
const authController = require('../controllers/authenticationController');

router.route('/')
.post(passport.authenticate('jwt',{session:false}),
 authController.roleAuthorization([rolesObj.ADMIN]),
 devicesController.create);

// router.route('/:id')
// .put(validateParam(paramSchemas.idSchema,'id'),
// validateBody(schemas.updateRoleSchema),
// passport.authenticate('jwt',{session:false}),
// authController.roleAuthorization([]),
// rolesController.update);

module.exports = router;