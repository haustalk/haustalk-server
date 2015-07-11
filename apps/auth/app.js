var express = require('express');
var subdomain = require('express-subdomain');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var oauth2 = require('./app/oauth2');

//Create a new express app
var app = express();

//Configure jade view engine
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'jade');

//This application will only route through the users.* subdomain
app.use(subdomain('accounts', require('./app/router')));

//Passport setup
app.use(passport.initialize()); //Initilize passport
require('./app/auth'); //Add the passport authentication strategies
app.post('/oauth/token', oauth2.token);
app.get('/api/userInfo',
    passport.authenticate('bearer', { session: false }),
        function(req, res) {
            // req.authInfo is set using the `info` argument supplied by
            // `BearerStrategy`.  It is typically used to indicate a scope of the token,
            // and used in access control checks.  For illustrative purposes, this
            // example simply returns the scope in the response.
            res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
        }
);

//Export the authentication app for use an the main application
module.exports = app;