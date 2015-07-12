var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./apps/core/config');
var log = require('./apps/core/log')(module);

//Parses posted data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Keep track of user sessions
app.use(require('express-session')({
    secret: config.get('express-session:secret'),
    resave: false,
    saveUninitialized: false
}));

//Connect mongo database
var mongoose   = require('mongoose');
mongoose.connect(config.get('database:uri'));

//Serve the API application
app.use(require('./apps/api/app'));

//Serve the authentication application
app.use(require('./apps/auth/app'));

//Start server
app.listen(config.get('port'), function () {
	log.info('Server started on port: ' + config.get('port'));
});