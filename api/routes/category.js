const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/categoryRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const categoryController = require('../controllers/category');
const authController = require('../controllers/authentication');
const rolesList = require('../auth/roles');

router.route('/')
.get(passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
categoryController.getCategories);

router.route('/:id')
.get(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{session: false}),
authController.roleAuthorization([rolesList.PowerUser, rolesList.Admin, rolesList.Supervisor, rolesList.Manager, rolesList.User]),
categoryController.getCategory);

router.route('/create')
.post(validateBody(schemas.createCategorySchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
categoryController.create);

router.route('/:id')
.put(validateParam(paramSchemas.idSchema,'id'),
validateBody(schemas.updateCategorySchema),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
categoryController.update);

router.route('/:id')
.delete(validateParam(paramSchemas.idSchema,'id'),
passport.authenticate('jwt',{ session: false }),
authController.roleAuthorization([rolesList.Admin]),
categoryController.delete);


module.exports = router;