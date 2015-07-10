var express  = require('express');
var router   = express.Router();

//Request middleware
router.use(function(req, res, next) {
    console.log('I am a thing.');
    next(); // make sure we go to the next routes and don't stop here
});

//Root welcome screen for API
router.get('/', function(req, res) {
    res.json({ message: 'This is an api' });   
});

//Include the routes for the dimmer
router.use('/devices', require('./api/device'));

module.exports = router;