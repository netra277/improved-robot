const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/roleRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const rolesController = require('../controllers/rolesController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(rolesController.getRoles);

router.route('/:id')
.get(rolesController.getRole);

router.route('/')
.post(rolesController.create);

router.route('/:id')
.put(rolesController.update);

// router.route('/:id')
// .put(validateParam(paramSchemas.idSchema,'id'),
// validateBody(schemas.updateRoleSchema),
// passport.authenticate('jwt',{session:false}),
// authController.roleAuthorization([]),
// rolesController.update);

module.exports = router;