const router = require('express-promise-router')();
const passport = require('passport');

const rolesController = require('../controllers/roles');

router.route('/')
.get(passport.authenticate('jwt',{session:false}), rolesController.getRoles);

router.route('/')
.post(passport.authenticate('jwt',{session:false}), rolesController.create);

router.route('/:id')
.delete(passport.authenticate('jwt',{session:false}), rolesController.delete);

router.route('/:id')
.put(passport.authenticate('jwt',{session:false}), rolesController.update)

module.exports = router;