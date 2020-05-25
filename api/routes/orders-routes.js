const router = require('express-promise-router')();
const passport = require('passport');
const { validateBody, schemas } = require('../validators/orderRouteHelper');
const { validateParam, paramSchemas } = require('../validators/commonRouterHelper');

const ordersController = require('../controllers/ordersController');
const authController = require('../controllers/authenticationController');

router.route('/')
.get(ordersController.getOrders);

router.route('/:id')
.get(ordersController.getOrder);

router.route('/create')
.post(ordersController.create);

router.route('/:id')
.put(ordersController.update);

router.route('/:id')
.delete(ordersController.delete);


module.exports = router;