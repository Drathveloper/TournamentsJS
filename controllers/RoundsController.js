var Round = require('../models/RoundsModel');
var Match = require('../models/MatchesModel');
var User = require('../models/UsersModel');

exports.index = function (req, res, next) {

};

exports.roundDetails = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        Round.findOne({_id: req.params.id}).populate('tournament_id').exec(function (err, round) {
            if (round) {
                Match.find({round_id: round._id}).populate('player1_id').populate('player2_id').exec(function (err, matches) {
                    if (matches) {
                        res.render('round/details', {
                            title: round.tournament_id.name + ": Ronda " + round.round_number,
                            round: round,
                            matches: matches,
                            username: req.session.user,
                        });
                    } else {
                        res.send('Partida no encontrada');
                    }
                });
            } else {
                res.send('Ronda no encontrada');
            }
        });
    });
};