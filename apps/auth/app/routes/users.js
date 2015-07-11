var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var log = require('../../../core/log');

//Root page for Users
router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

//Page to register a new user
router.get('/register', function(req, res) {
    res.render('register', { });
});

//Handle registration of a new user
router.post('/register', function(req, res) {
    //Create a new user
    var user = new User({ 
        username: req.body.username,
        password: req.body.password 
    });
    //Store the new user in the system
    user.save(function (err, user) {
        //Check if there was an error
        if (err) {
            return res.status(422).render('register', {info: 'That username already exists.'});
        }
        log.info('Registered new user: ' + user.username);
        //Redirect the user to the root page
        res.redirect('/');
    });
});

module.exports = router;