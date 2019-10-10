const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../helpers/itemRouteHelper');
const { validateParam, paramSchemas } = require('../helpers/commonRouterHelper');

const itemsController = require('../controllers/items');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
itemsController.getItems);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
itemsController.getItem);

router.route('/create')
.post(validateBody(schemas.createItemSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
itemsController.create);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateItemSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
itemsController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
itemsController.delete);


module.exports = router;