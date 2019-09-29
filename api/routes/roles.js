const router = require('express-promise-router')();
const passport = require('passport');

const rolesController = require('../controllers/roles');

router.route('/')
.get(rolesController.getRoles);

router.route('/')
.post(rolesController.create);

router.route('/:id')
.delete(passport.authenticate('jwt',{session:false}),rolesController.delete);

module.exports = router;