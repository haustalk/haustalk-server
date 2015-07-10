var express = require('express');
var router = express.Router();

//Create middleware to process router requests
router.use(function(req, res, next) {
    console.log('API Received request.');
    next();
});

//Root welcome screen for API
router.get('/', function(req, res) {
    res.json({ message: 'This is the haustalk API'});
});

//Include the routes for the dimmer
router.use('/devices', require('./routes/device'));

//Export the router to be used in the app
module.exports = router;