const router = require('express-promise-router')();
const passport = require('passport');
//const { validateBody, schemas } = require('../validators/roleRouteHelper');
//const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const devicesController = require('../controllers/devicesController');
const authController = require('../controllers/authenticationController');

router.route('/')
.post(passport.authenticate('admindevicesjwt',{session:false}),
 devicesController.create);

 router.route('/:id')
.put(passport.authenticate('admindevicesjwt',{session:false}),
 devicesController.update);

 router.route('/')
.get(passport.authenticate('admindevicesjwt',{session:false}),
 devicesController.getAll);

 router.route('/:id')
.get(passport.authenticate('admindevicesjwt',{session:false}),
 devicesController.get);

 router.route('/:id')
 .delete(passport.authenticate('admindevicesjwt',{session:false}),
  devicesController.delete);

  router.route('/deactivate/:id')
 .put(passport.authenticate('admindevicesjwt',{session:false}),
  devicesController.deactivate);

  router.route('/:id/generatekey')
 .put(passport.authenticate('admindevicesjwt',{session:false}),
  devicesController.generateNewKey);

  router.route('/register')
 .post(devicesController.register);

// router.route('/:id')
// .put(validateParam(paramSchemas.idSchema,'id'),
// validateBody(schemas.updateRoleSchema),
// passport.authenticate('jwt',{session:false}),
// authController.roleAuthorization([]),
// rolesController.update);

module.exports = router;