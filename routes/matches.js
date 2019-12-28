var express = require('express');
var router = express.Router();
var matchController = require('../controllers/MatchesController.js');

router.get('/', matchController.index);
router.get('/:id/', matchController.matchDetails);
router.get('/:id/postResults', matchController.postResultsGet);
router.post('/:id/postResults', matchController.postResultsPost);

module.exports = router;