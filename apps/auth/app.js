var express = require('express');
var subdomain = require('express-subdomain');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

//Create a new express app
var app = express();

//Configure jade view engine
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'jade');

//Passport setup
var Account = require('./app/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

//This application will only route through the users.* subdomain
app.use(subdomain('accounts', require('./app/router')));

//Export the authentication app for use an the main application
module.exports = app;