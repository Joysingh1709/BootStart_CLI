const router = require('express').Router();

const { homeController, homeApiController } = require('../controllers/home.controller')

router.get('/', homeController)
router.get('/api', homeApiController)

module.exports = router;