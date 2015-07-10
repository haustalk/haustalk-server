var express = require('express');
var app = express();
var bodyParser = require('body-parser');



//Parses posted data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//The port that the connection
var port = process.env.PORT || 8800;

//Connect to mongo
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/myapp');

//Serve the API application
app.use(require('./apps/api/app'));

//Start server
app.listen(port);
console.log('Server started on port: ' + port);