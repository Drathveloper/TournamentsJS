var express = require('express');
var router = express.Router();
var tournamentController = require('../controllers/TournamentController.js');

router.get('/', tournamentController.index);
router.get('/add', tournamentController.addTournamentGet);
router.post('/add', tournamentController.addTournamentPost);
router.get('/tournament_json', tournamentController.getTournamentList);
router.get('/:id', tournamentController.tournamentDetails);
router.get('/:id/delete', tournamentController.deleteTournamentGet);
router.get('/:id/update', tournamentController.updateTournamentGet);
router.post('/:id/update', tournamentController.updateTournamentPost);
router.get('/:id/register', tournamentController.registerUserTournament);
router.get('/:id/unregister', tournamentController.unregisterUserTournament);
router.get('/:id/start', tournamentController.startTournament);
router.get('/:id/generateRound', tournamentController.generateNextRound);
router.get('/:id/rounds_json', tournamentController.getRoundsList);

module.exports = router;