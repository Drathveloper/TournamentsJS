var express = require('express');
var User = require('../models/UsersModel');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user){
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        res.render('general/index', {title: 'Inicio', username: req.session.user});
    });
});

router.get('/index', function (req,res,next) {
        User.find({sid: req.cookies.keepSession}, function (err, user) {
            if(user) {
                if (user.sid === req.cookies.keepSession && !req.session.user) {
                    req.session.user = user.username;
                }
            }
            res.render('general/index', {title: 'Inicio', username: req.session.user});
        });
});

router.get('/contact', function (req, res, next) {
    User.findOne({sid: req.cookies.keepSession}, function (err, user) {
        if(user) {
            if (user.sid === req.cookies.keepSession && !req.session.user) {
                req.session.user = user.username;
            }
        }
        res.render('general/contact', {title: 'Contacto', username: req.session.user});
    });
});

module.exports = router;
