const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/orderRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const ordersController = require('../controllers/orders');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
ordersController.getOrders);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
ordersController.getOrder);

router.route('/create')
.post(validateBody(schemas.createOrderSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
ordersController.create);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateOrderSchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
ordersController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
ordersController.delete);


module.exports = router;