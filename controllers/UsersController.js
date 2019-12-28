var User = require('../models/UsersModel.js');
var Roles = require('../models/RolesModel.js');
var Tournament = require('../models/TournamentsModel.js');
var Bcrypt = require('bcrypt');

exports.addUserGet = function (req, res) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if(req.session.user){
            res.render('general/index', {title:'Inicio', username:req.session.user});
        } else {
            Roles.findOne({name:'User'}, function (err, roles) {
                if(err){
                    res.render('general/index', {title: 'Inicio', username:req.session.user, message: 'Hubo un problema al procesar la petición'});
                }
                res.render('user/register', {title: 'Registro', username:req.session.user, rol: roles.role_id});
            });
        }
    });
};

exports.addUserPost = function (req, res, next) {
    Roles.find({role_id : req.body.roles}, {_id:1, role_id: 1, name:1, roleid: 1}, function (err, rl) {
        if (err) {
            return next(err);
        }
        var roleMap = {};
        rl.forEach(function (roles) {
            roleMap[roles.role_id] = roles._id;
        });
        var user = new User({
            email : req.body.email,
            username : req.body.username,
            password : Bcrypt.hashSync(req.body.password, 10),
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            birth_date : req.body.birth_date,
            role : roleMap[req.body.roles],
            sid: null,
        });
        user.save(function(err){
            if(err){
                return next(err);
                //res.render('user/register', {title:'Registro', username:req.session.user, message: 'Hubo un problema durante el registro'});
            } else {
                res.redirect('/users/login');
            }
        });
    });
};

exports.loginUserGet = function (req, res) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user){
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}).populate('role').exec(function (err) {
                res.redirect('/users/dashboard');
            });
        } else {
            //res.redirect('/users/login');
            res.render('user/login', {title: 'Iniciar sesión', username: req.session.username});
        }
    });
};

exports.loginUserPost = function (req, res, next) {
    User.findOne({username:req.body.username}).populate('role').exec(function (err, usr) {
        if(err){
           return next(err);
        }
        if(usr!=null){
            if(Bcrypt.compareSync(req.body.password, usr.password)){
                req.session.user = req.body.username;
                usr.set({sid:req.session.id});
                if(req.body.remember){
                    let cookieDate = new Date();
                    cookieDate.setFullYear(cookieDate.getFullYear() + 1);
                    res.cookie('keepSession',req.session.id, { maxAge: cookieDate.getTime(), httpOnly: true });
                }
                usr.update({username:req.body.username}, {$set:{sid:req.session.id}}, function(err, updatedUsr){
                    if(err){
                        return next(err);
                    }
                    usr.save(updatedUsr);
                });
                res.redirect('/users/dashboard');
            } else {
                res.render('user/login', {title: 'Iniciar sesión', username: req.session.user, message: 'La contraseña no es correcta'});
            }
        } else {
            res.render('user/login', {title: 'Iniciar sesión', username: req.session.user, message: 'El nombre de usuario no es correcto'});
        }
    });
};

exports.logout = function (req, res, next) {
    req.session.destroy();
    if(req.cookies.keepSession){
        res.clearCookie('keepSession');
    }
    res.redirect('/index');
    //res.render('general/index', {title:'Inicio', username: undefined, message:'Sesión cerrada correctamente'});
};

exports.usersDashboard = function(req, res, next){
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}).populate('role').exec(function (err, user) {
                if (err) return next(err);
                res.render('user/dashboard', {
                    title: 'Usuario: ' + req.session.user,
                    username: user.username,
                    role: user.role.role_id
                });
            });
        } else {
            res.render('general/index', {title: 'Inicio', username: req.session.user});
        }
    });
};

exports.userlist = function (req, res, next) {
    User.find({}, {username: 1, email: 1}, function (err, users) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(users));
    });
};

exports.myTournaments = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            User.findOne({username: req.session.user}).populate('role').exec(function (err, user) {
                if (user.role.role_id === 1) {
                    Tournament.find({players: user._id}).populate('tournament_organizer').populate('tournament_type').exec(function (err, tours) {
                        console.log("Torneos: " + tours);
                        res.render('tournament/list2', {
                            title: 'Torneos',
                            tournaments: tours,
                            username: user.username,
                            role: user.role,
                            useLocal: false
                        });
                    });
                } else if (user.role.role_id === 2) {
                    Tournament.find({tournament_organizer: user._id}).populate('tournament_organizer').populate('tournament_type').exec(function (err, tournaments) {
                        res.render('tournament/list2', {
                            title: 'Torneos',
                            tournaments: tournaments,
                            username: user.username,
                            role: user.role,
                            useLocal: false
                        });
                    });
                } else {
                    res.redirect('/index');
                }
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.adminPanel = function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        if (req.session.user) {
            console.log(req.session.user);
            console.log(req.session);
            User.findOne({username: req.session.user}).populate('role').exec(function (err, user) {
                if (err) return next(err);
                console.log(user);
                if (user.role.role_id === 7) {
                    User.find({}).populate('role').exec(function (err, allUsers) {
                        Roles.find({}, function (err, roles) {
                            res.render('user/userlist', {
                                title: "Panel de administración",
                                users: allUsers,
                                roles: roles,
                                username: req.session.user,
                            });
                        });
                    });
                } else {
                    res.render('error');
                }
            });
        } else {
            res.redirect('/users/login');
        }
    });
};

exports.adminPanelPost = function (req, res, next) {
    User.findOne({username: req.body.user}, function (err, user) {
        Roles.findOne({role_id: req.body.role}, function (err, role) {
            user.role = role._id;
            user.save(function (err) {
                if(err) return next(err);
                res.redirect('/users/admin');
            });
        });
    });
};