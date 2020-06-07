const router = require('express-promise-router')();
const passport = require('passport');
const rolesObj = require('../constants/enums').Roles;

const itemsController = require('../controllers/itemsController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
itemsController.getItems);

router.route('/:id')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
itemsController.getItem);

router.route('/')
.post(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
itemsController.create);

router.route('/:id')
.put(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
itemsController.update);

router.route('/:id')
.delete(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesObj.ADMIN]),
itemsController.delete);


module.exports = router;