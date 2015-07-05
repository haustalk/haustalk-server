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

//API Routes
var router = express.Router();

//Request middleware
router.use(function(req, res, next) {
    console.log('I am a thing.');
    next(); // make sure we go to the next routes and don't stop here
});

//Root welcome screen
router.get('/', function(req, res) {
    res.json({ message: 'This is an api' });   
});

router.use('/devices', require('./app/routes/device'));

//Register routes
app.use('/api', router);

//Start server
app.listen(port);
console.log('Magic happens on port ' + port);