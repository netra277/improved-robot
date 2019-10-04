const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../helpers/branchRouteHelper');
const { validateParam, paramSchemas } = require('../helpers/commonRouterHelper');

const branchController = require('../controllers/branches');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor]),
branchController.getBranches);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager]),
branchController.getBranch);

router.route('/create')
.post(validateBody(schemas.createBranchSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
branchController.create);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateBranchSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
branchController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
branchController.delete);


module.exports = router;