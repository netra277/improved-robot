const router = require('express-promise-router')();
const passport = require('passport');
const rolesObj = require('../constants/enums').Roles;

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
categoryController.getCategories);

router.route('/:id')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
categoryController.getCategory);

router.route('/')
.post(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
categoryController.create);

router.route('/:id')
.put(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
categoryController.update);

router.route('/:id')
.delete(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
categoryController.delete);


module.exports = router;