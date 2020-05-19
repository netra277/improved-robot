const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

const { validateBody, schemas } = require('../validators/clientRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');
const clientsController = require('../controllers/clients');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser]),
clientsController.getClients);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser]),
clientsController.getClient);

router.route('/create')
.post(validateBody(schemas.createClientSchema),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([]),
clientsController.create);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateClientSchema),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([]),
clientsController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([]),
clientsController.delete);

module.exports = router;