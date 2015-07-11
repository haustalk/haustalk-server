var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Parses posted data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//The port that the connection
var port = process.env.PORT || 8800;

//Keep track of user sessions
app.use(require('express-session')({
    secret: 'bubbacheese987AA3',
    resave: false,
    saveUninitialized: false
}));

//Connect to mongo
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/myapp');

//Serve the API application
app.use(require('./apps/api/app'));

//Serve the authentication application
app.use(require('./apps/auth/app'));

//Start server
app.listen(port);
console.log('Server started on port: ' + port);