const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/itemRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const itemsController = require('../controllers/itemsController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(itemsController.getItems);

router.route('/:id')
.get(itemsController.getItem);

router.route('/create')
.post(itemsController.create);

router.route('/:id')
.put(itemsController.update);

router.route('/:id')
.delete(itemsController.delete);


module.exports = router;