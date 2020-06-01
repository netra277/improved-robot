const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/branchRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');
const rolesObj = require('../constants/enums').Roles;

const branchController = require('../controllers/branchesController');
const authController = require('../controllers/authenticationController');

// router.route('/')
// .get(passport.authenticate('jwt',{session: false}),
// authController.roleAuthorization([rolesList.Admin, rolesList.StoreSupervisor]),
// branchController.getBranches);

router.route('/')
.get(branchController.getBranches);

router.route('/:id')
.get(branchController.getBranch);

router.route('/')
.post(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
branchController.create);

router.route('/:id')
.put(branchController.update);

router.route('/:id')
.delete(branchController.delete);


module.exports = router;