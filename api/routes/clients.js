const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../auth/passport');

//const { validateBody, schemas } = require('../helpers/userRouteHelpers');
const clientsController = require('../controllers/clients');

// router.route('/signUp')
// .post(validateBody(schemas.authSchema), usersController.signUp);

router.route('/')
.get(clientsController.getClients);

// router.route('/secret')
// .get(passport.authenticate('jwt',{session:false}), usersController.secret);

module.exports = router;