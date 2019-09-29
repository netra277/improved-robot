const router = require('express-promise-router')();

const clientsController = require('../controllers/clients');

router.route('/')
.get(clientsController.getClients);


router.route('/')
.post(clientsController.create);

module.exports = router;