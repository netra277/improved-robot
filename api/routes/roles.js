const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/roleRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const rolesController = require('../controllers/roles');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session:false}), 
authController.roleAuthorization([rolesList.PowerUser,rolesList.Admin]),
rolesController.getRoles);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser]),
rolesController.getRole);

router.route('/create')
.post(validateBody(schemas.createRoleSchema),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([]),
rolesController.create);


router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session:false}),
authController.roleAuthorization([]),
rolesController.delete);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateRoleSchema),
passport.authenticate('jwt',{session:false}),
authController.roleAuthorization([]),
rolesController.update);

module.exports = router;