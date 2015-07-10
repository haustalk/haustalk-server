var express = require('express');
var subdomain = require('express-subdomain');
var app = express();

//This application will only route through the api.* subdomain
app.use(subdomain('api', require('./app/router')));

//Export the application
module.exports = app;