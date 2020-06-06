const router = require('express-promise-router')();
const passport = require('passport');

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(categoryController.getCategories);

router.route('/:id')
.get(categoryController.getCategory);

router.route('/create')
.post(categoryController.create);

router.route('/:id')
.put(categoryController.update);

router.route('/:id')
.delete(categoryController.delete);


module.exports = router;