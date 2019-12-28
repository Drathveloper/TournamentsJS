var express = require('express');
var router = express.Router();
var roundController = require('../controllers/RoundsController.js');

router.get('/', roundController.index);
router.get('/:id/', roundController.roundDetails);

module.exports = router;