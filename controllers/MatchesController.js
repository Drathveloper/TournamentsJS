var Match = require('../models/MatchesModel');
var Tournament = require('../models/TournamentsModel');
var Round = require('../models/RoundsModel');
var User = require('../models/UsersModel');

exports.index = function (req, res, next) {

};

exports.matchDetails = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        Match.findOne({_id: req.params.id}).populate('player1_id').populate('player2_id').populate('outcome').exec(function (err, match) {
            if (err) {
                return next(err);
            }
            if (match) {
                Round.findOne({_id: match.round_id}).populate('tournament_id').exec(function (err, round) {
                    Tournament.findOne({_id: round.tournament_id}).populate('tournament_organizer').exec(function (err, tour) {
                        let isOrganizer = tour.tournament_organizer.username === req.session.user;
                        res.render('match/details', {
                            title: round.tournament_id.name + " R" + round.round_number + " Mesa " + match.table_number,
                            round: round,
                            match: match,
                            username: req.session.user,
                            isOrganizer: isOrganizer,
                        });
                    });
                });
            } else {
                res.redirect('/tournaments/');
            }
        });
    });
};

exports.postResultsGet = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        Match.findOne({_id: req.params.id}).populate('round_id').populate('player1_id').populate('player2_id').exec(function (err, match) {
            Tournament.findOne({_id: match.round_id.tournament_id}).populate('tournament_organizer').exec(function (err, tour) {
                console.log(tour);
                if (req.session.user === tour.tournament_organizer.username) {
                    res.render('match/addResult', {
                        title: "Añadir resultado",
                        match: match,
                        organizer: tour.tournament_organizer.username,
                        username: req.session.user,
                    });
                } else {
                    res.send('Error');
                }
            });
        });
    });
};

exports.postResultsPost = function (req, res, next) {
    if(req.body.organizer === req.session.user){
        Match.findByIdAndUpdate(req.params.id, {$set: {outcome: req.body.winner}}, function (err, match) {
            if(err){return next(err);}
            Match.findOne({_id: match._id}).populate('round_id').exec(function (err, thematch) {
                if(err) return next(err);
                res.redirect(thematch.round_id.url);
            });
            //res.send('Actualizado');
        });
    } else {
        res.send('Error');
    }
};
