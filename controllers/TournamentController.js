let Tournament = require('../models/TournamentsModel');
let User = require('../models/UsersModel');
let Roles = require('../models/RolesModel');
let Types = require('../models/TypesModel');
let Round = require('../models/RoundsModel');
let Match = require('../models/MatchesModel');
let mongoose = require('mongoose');
let Moment = require('moment');

const MIN_PLAYERS = 4;

exports.index = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        res.render('tournament/list', {
            title: 'Torneos',
            username: req.session.user,
            useLocal: true,
        });
    });
};

exports.tournamentDetails = function (req, res) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        Tournament.findOne({_id: req.params.id}).populate('tournament_type').populate('tournament_organizer').populate('players').exec(function (err, tournament) {
            if (tournament) {
                Round.find({tournament_id: tournament._id}, function (err, rounds) {
                    if (rounds) {
                        User.findOne({username: req.session.user}).populate('role').exec(function (err, user) {
                            let isPlayer = false;
                            let isRegistered = false;
                            let hasFinished = false;
                            let hasStarted = false;
                            let isTheOrganizer = tournament.tournament_organizer.username === req.session.user;
                            if (user) {
                                isPlayer = user.role.role_id === 1;
                                for (let i = 0; i < tournament.players.length; i++) {
                                    if (tournament.players[i].username === user.username) {
                                        isRegistered = true;
                                    }
                                }
                            }
                            if (tournament.standings) {
                                hasFinished = tournament.standings.length > 0;
                            }
                            if (rounds) {
                                hasStarted = rounds.length > 0;
                            }
                            res.render('tournament/details', {
                                title: "Torneo: " + tournament.name,
                                username: req.session.user,
                                isPlayer: isPlayer,
                                isRegistered: isRegistered,
                                isTheOrganizer: isTheOrganizer,
                                hasStarted: hasStarted,
                                hasFinished: hasFinished,
                                tour_url: tournament.url,
                            });
                        });
                    } else {
                        res.redirect('/tournaments/');
                    }
                });
            } else {
                res.redirect('/tournaments/');
            }
        });
    });
};

exports.addTournamentGet = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}).populate('role').exec(function (err, user) {
                if (err) return next(err);
                if (user.role.role_id === 2) {
                    Types.find({}, function (err, types) {
                        res.render('tournament/add', {
                            title: 'Añadir torneo',
                            tournamentTypes: types,
                            username: req.session.user,
                            organizer: req.session.user,
                        });
                    });
                } else {
                    res.redirect(/tournaments/);
                }
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.addTournamentPost = function (req, res, next) {
    Types.findOne({type_id: req.body.type}, {_id: 1}, function (err, type) {
        User.findOne({username: req.body.organizer}, {_id: 1}, function (err, user) {
            let tournament = new Tournament({
                name: req.body.name,
                tournament_date: req.body.date,
                tournament_type: type._id,
                tournament_cap: req.body.cap,
                tournament_organizer: user._id,
            });
            tournament.save(function (err) {
                if (err) {
                    return next(err);
                } else {
                    req.flash('info', 'it works');
                    res.redirect('/');
                }
            });
        });
    })
};

exports.deleteTournamentGet = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}, {_id: 1}, function (err, user) {
                if (err) {
                    return next(err);
                }
                Tournament.findOne({tournament_organizer: user._id, _id: req.params.id}, function (err, tournament) {
                    if (err) {
                        return next(err);
                    }
                    if (tournament) {
                        Tournament.remove({_id: req.params.id}, function (err) {
                            if (err) {
                                next(err);
                            }
                            res.redirect('/tournaments/');
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.updateTournamentGet = function (req, res) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}, {_id: 1}, function (err, user) {
                Tournament.findOne({_id: req.params.id, tournament_organizer: user._id}, function (err, tournament) {
                    if (tournament) {
                        Types.find({}, {_id: 1, type_id: 1, name: 1}, function (err, types) {
                            res.render('tournament/update', {
                                title: 'Actualizar torneo',
                                tournament: tournament,
                                date: Moment(tournament.tournament_date).format('YYYY-MM-DD'),
                                tournamentTypes: types,
                                username: req.session.user,
                            });
                        });
                    } else {
                        res.redirect('/tournaments/');
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.updateTournamentPost = function (req, res) {
    if (req.session.user) {
        User.findOne({username: req.session.user}, {_id: 1}, function (err, user) {
            Tournament.findOne({_id: req.params.id, tournament_organizer: user._id}, function (err, tour) {
                if (tour) {
                    Types.findOne({type_id: req.body.type}, {_id: 1}, function (err, type) {
                        let tournament = new Tournament({
                            _id: tour._id,
                            name: req.body.name,
                            tournament_date: req.body.date,
                            tournament_cap: req.body.cap,
                            tournament_organizer: user._id,
                            tournament_type: type._id,
                            standings: tour.standings,
                            players: tour.players,
                        });
                        Tournament.findByIdAndUpdate(tour._id, tournament, {}, function (err, updatedTour) {
                            if (err) {
                            }
                            res.redirect(updatedTour.url);
                        });
                    });
                } else {
                    res.redirect('/tournaments/');
                }
            });
        });
    } else {
        res.redirect('/users/login');
    }
};

exports.registerUserTournament = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}, function (err, usr) {
                Roles.findOne({_id: usr.role}, function (err, role) {
                    if (role.role_id === 1) {
                        Tournament.findOne({_id: req.params.id}, function (err, tour) {
                            let registeredUsers = tour.players;
                            if (registeredUsers.indexOf(usr._id) == -1 && tour.players.length < tour.tournament_cap) {
                                Round.find({tournament_id: tour._id}, function (err, rounds) {
                                    if (rounds.length === 0) {
                                        registeredUsers.push(usr._id);
                                        Tournament.findByIdAndUpdate(req.params.id, {$set: {players: registeredUsers}}, {}, function (err, updatedTour) {
                                            if (err) {
                                                next(err);
                                            }
                                            if (updatedTour) {
                                                res.send('Usuario registrado correctamente');
                                            }
                                        });
                                    } else {
                                        res.send('No puedes apuntarte a un torneo que ya ha empezado');
                                    }
                                });
                            } else if (tour.players.length >= tour.tournament_cap) {
                                res.send('El torneo no admite más jugadores');
                            } else {
                                res.send('El usuario ya está registrado');
                            }
                        });
                    } else {
                        res.send('Los organizadores o administradores no pueden participar');
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.getTournamentList = function (req, res, next) {
    Tournament.find().populate('tournament_type').populate('tournament_organizer').populate('players').exec(function (err, tournaments) {
        if (err) return next(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(tournaments));
    });
};

exports.getRoundsList = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        Tournament.findOne({_id: req.params.id}).populate('tournament_type').populate('tournament_organizer').populate('players').exec(function (err, tournament) {
            Round.find({tournament_id: req.params.id}, function (err, rounds) {
                let roundsIdList = [];
                for (let i = 0; i < rounds.length; i++) {
                    roundsIdList.push(rounds[i]._id);
                }
                Match.find({round_id: {$in: roundsIdList}}).populate('player1_id').populate('player2_id').populate('outcome').exec(function (err, matches) {
                    var list = [];
                    for (let j = 0; j < rounds.length; j++) {
                        let matchList = [];
                        for (let i = 0; i < matches.length; i++) {
                            if (matches[i].round_id.toString() === rounds[j]._id.toString()) {
                                matchList.push(matches[i]);
                            }
                        }
                        let obj = {
                            _id: rounds[j]._id,
                            round_number: rounds[j].round_number,
                            matches: matchList,
                        };
                        list.push(obj);
                    }
                    var tour = {
                        _id: tournament._id,
                        name: tournament.name,
                        tournament_date: tournament.tournament_date,
                        tournament_type: tournament.tournament_type,
                        tournament_cap: tournament.tournament_cap,
                        tournament_organizer: tournament.tournament_organizer,
                        standings: tournament.standings,
                        players: tournament.players,
                        rounds: list,
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(tour));
                });
            });
        });
    });
};

exports.unregisterUserTournament = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}, function (err, usr) {
                Roles.findOne({_id: usr.role}, function (err, role) {
                    if (role.role_id === 1) {
                        Tournament.findOne({_id: req.params.id, players: {$in: [usr._id]}}, function (err, tour) {
                            if (tour) {
                                Round.find({tournament_id: tour._id}, function (err, rounds) {
                                    if (rounds.length === 0) {
                                        let registeredUsers = tour.players;
                                        let playerIndex = registeredUsers.indexOf(usr._id);
                                        registeredUsers.splice(playerIndex, 1);
                                        Tournament.findByIdAndUpdate(req.params.id, {$set: {players: registeredUsers}}, {}, function (err) {
                                            if (err) {
                                                next(err);
                                            }
                                            res.send('El usuario canceló su participación correctamente.');
                                        });
                                    } else {
                                        res.send('No puedes cancelar tu participación en un torneo en curso o ya finalizado');
                                    }
                                });
                            } else {
                                res.send('El usuario no está registrado en este torneo.')
                            }
                        });
                    } else {
                        res.send('Los organizadores o administradores no pueden participar');
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.startTournament = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}, function (err, usr) {
                Tournament.findOne({_id: req.params.id, tournament_organizer: usr._id}, function (err, tour) {
                    if (tour) {
                        Round.find({tournament_id: tour._id}, function (err, rounds) {
                            if (rounds.length == 0) {
                                if (Moment(tour.tournament_date).isSame(new Date(), 'day') && tour.players.length >= MIN_PLAYERS) {
                                    let numberPlayers = tour.players.length;
                                    let list = shufflePlayers(tour.players);
                                    if (isPowerOfTwo(numberPlayers)) {
                                        let matchesID = [];
                                        let roundID = mongoose.Types.ObjectId();
                                        for (let i = 0; i < list.length; i += 2) {
                                            matchesID.push(mongoose.Types.ObjectId());
                                        }
                                        let cont = 0;
                                        while (cont < list.length / 2) {
                                            let match = new Match({
                                                _id: matchesID[cont],
                                                round_id: roundID,
                                                player1_id: list[cont],
                                                player2_id: list[list.length - cont - 1],
                                                table_number: cont + 1,
                                            });
                                            match.save(function (err) {
                                                if (err) {
                                                    return next(err);
                                                }
                                            });
                                            cont++;
                                        }
                                        let round = new Round({
                                            _id: roundID,
                                            tournament_id: tour._id,
                                            round_number: 1,
                                        });
                                        round.save(function (err) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                res.send('Torneo iniciado correctamente');
                                            }
                                        });
                                    } else {
                                        var nextPower = nextPowerOfTwo(numberPlayers);
                                        var numberMatches = ((2 * numberPlayers) - nextPower) / 2;
                                        let roundID = mongoose.Types.ObjectId();
                                        let playersSelected = [];
                                        for (let i = list.length - 1; i > ((list.length - 1) - (numberMatches * 2)); i--) {
                                            playersSelected.push(list[i]);
                                        }
                                        for (let i = 0; i < playersSelected.length; i++) {
                                            if (list.indexOf(playersSelected[i]) > -1) {
                                                list.splice(list.indexOf(list.indexOf(playersSelected[i])), 1);
                                            }
                                        }
                                        let matchesID = [];
                                        for (let i = 0; i < numberMatches; i += 2) {
                                            matchesID.push(mongoose.Types.ObjectId());
                                        }
                                        let matchesID2 = [];
                                        for (let i = 0; i < list.length; i++) {
                                            matchesID2.push(mongoose.Types.ObjectId());
                                        }
                                        for (let i = 0; i < playersSelected.length; i += 2) {
                                            let match = new Match({
                                                _id: matchesID[i],
                                                round_id: roundID,
                                                player1_id: playersSelected[i],
                                                player2_id: playersSelected[playersSelected.length - i - 1],
                                                table_number: i + 1,
                                            });
                                            match.save(function (err) {
                                                if (err) {
                                                    return next(err);
                                                }
                                            });
                                        }
                                        for (let i = 0; i < list.length; i++) {
                                            let match = new Match({
                                                _id: matchesID2[i],
                                                round_id: roundID,
                                                player1_id: list[i],
                                                player2_id: null,
                                                table_number: numberMatches + i + 1,
                                                outcome: list[i],
                                            });
                                            match.save(function (err) {
                                                if (err) {
                                                    return next(err);
                                                }
                                            });
                                        }
                                        let round = new Round({
                                            _id: roundID,
                                            tournament_id: tour._id,
                                            round_number: 1,
                                            //matches: matchesID.concat(matchesID2),
                                        });
                                        round.save(function (err) {
                                            if (err) {
                                                return next(err);
                                            } else {
                                                res.send('Torneo iniciado correctamente');
                                            }
                                        });
                                    }
                                } else if (!Moment(tour.tournament_date).isSame(new Date(), 'day')) {
                                    res.send('Aún no ha llegado la fecha del torneo');
                                } else {
                                    res.send('El número de jugadores es insuficiente');
                                }
                            } else {
                                res.send('El torneo ya ha comenzado, o su ID es incorrecta');
                            }
                        });
                    } else {
                        res.send('No eres el organizador de este torneo');
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.generateNextRound = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}, function (err, usr) {
                Tournament.findOne({_id: req.params.id, tournament_organizer: usr._id}, function (err, tour) {
                    if (tour) {
                        Round.find({tournament_id: tour._id}, function (err, rounds) {
                            let numberRounds = calculateNumberRounds(tour.players.length);
                            if (rounds.length >= 1 && rounds.length < numberRounds) {
                                let lastRound = rounds[rounds.length - 1];
                                Match.find({round_id: lastRound._id}, function (err, matches) {
                                    if (!checkOutcome(matches)) {
                                        res.send('Aún no se han jugado todas las partidas de la ronda');
                                    } else {
                                        let playerList = [];
                                        matches.forEach(function (element) {
                                            if (element.outcome) {
                                                playerList.push(element.outcome);
                                            }
                                        });
                                        if (playerList.length != matches.length) {
                                            res.redirect(tour.url);
                                        } else {
                                            var round = new Round({
                                                tournament_id: tour._id,
                                                round_number: rounds.length + 1,
                                            });
                                            round.save(function (err, rnd) {
                                                if (err) {
                                                    return next(err);
                                                }
                                                let table = 1;
                                                for (let i = 0; i <= playerList.length / 2; i++) {
                                                    var match = new Match({
                                                        round_id: rnd._id,
                                                        player1_id: playerList[i],
                                                        player2_id: playerList[i+1],
                                                        table_number: table,
                                                    });
                                                    i++;
                                                    table++;
                                                    match.save();
                                                }
                                                res.send('Ronda generada correctamente');
                                            });
                                        }
                                    }
                                });
                            } else if (rounds.length === numberRounds) {
                                if (tour.standings.length === 0) {
                                    let playerStandings = [];
                                    let roundIDs = [];
                                    for (let i = rounds.length - 1; i >= 0; i--) {
                                        roundIDs.push(rounds[i]._id);
                                    }
                                    Match.find({round_id: {$in: roundIDs}}).populate('round_id').populate('player1_id').populate('player2_id').populate('outcome').exec(function (err, matches) {
                                        if (!checkOutcome(matches)) {
                                            res.send('Aún no se han jugado todas las partidas de la ronda');
                                        } else {
                                            for (let i = numberRounds; i >= 1; i--) {
                                                for (let j = matches.length - 1; j >= 0; j--) {
                                                    if (matches[j].round_id.round_number === i) {
                                                        if (playerStandings.length === 0 && matches[j].outcome) {
                                                            playerStandings.push(matches[j].outcome.username);
                                                            if (matches[j].player1_id.username != matches[j].outcome.username) {
                                                                playerStandings.push(matches[j].player1_id.username);
                                                            } else {
                                                                playerStandings.push(matches[j].player2_id.username);
                                                            }
                                                        } else {
                                                            if (matches[j].player1_id && matches[j].player2_id) {
                                                                if (playerStandings.indexOf(matches[j].player1_id.username) === -1) {
                                                                    playerStandings.push(matches[j].player1_id.username);
                                                                } else {
                                                                    playerStandings.push(matches[j].player2_id.username);
                                                                }
                                                            } else if (matches[j].player1_id) {
                                                                if (playerStandings.indexOf(matches[j].player1_id.username) === -1) {
                                                                    playerStandings.push(matches[j].player1_id.username);
                                                                }
                                                            } else if (matches[j].player2_id) {
                                                                if (playerStandings.indexOf(matches[j].player2_id.username) === -1) {
                                                                    playerStandings.push(matches[j].player2_id.username);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            Tournament.findByIdAndUpdate(tour._id, {$set: {standings: playerStandings}}, function (err) {
                                                if (err) return next(err);
                                                res.send('Torneo finalizado correctamente');
                                            });
                                        }
                                    });
                                } else {
                                    //res.redirect(tour.url);
                                    res.send('El torneo ya ha finalizado');
                                }
                            } else {
                                res.send('El torneo aún no fue iniciado');
                            }
                        });
                    } else {
                        res.send('No eres el organizador de este torneo');
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

function checkOutcome(matches) {
    for (let i = 0; i < matches.length; i++) {
        if (!matches[i].outcome) {
            return false;
        }
    }
    return true;
}

function calculateNumberRounds(number) {
    if (!isPowerOfTwo(number)) {
        number = nextPowerOfTwo(number);
    }
    let i = 0;
    while (number > 1) {
        number = number / 2;
        i++;
    }
    return i;
}

function isPowerOfTwo(number) {
    let remainder;
    while (number > 1) {
        number = Number.parseInt(Math.floor(number / 2));
        remainder = number % 2;
    }
    return remainder === 0;
}

function nextPowerOfTwo(number) {
    let i = 1;
    while (Math.pow(2, i) < number) {
        i++
    }
    return Math.pow(2, i);
}

function shufflePlayers(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}