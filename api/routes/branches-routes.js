const router = require('express-promise-router')();
const passport = require('passport');
const rolesObj = require('../constants/enums').Roles;

const branchController = require('../controllers/branchesController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
branchController.getBranches);

router.route('/:id')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
branchController.getBranch);

router.route('/')
.post(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
branchController.create);

router.route('/:id')
.put(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
branchController.update);

router.route('/:id')
.delete(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
branchController.delete);


module.exports = router;