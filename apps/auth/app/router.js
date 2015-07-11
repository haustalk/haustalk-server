var express = require('express');
var router = express.Router();

//Include the routes for the dimmer
router.use('/', require('./routes/users'));

//Export the authentication app for use an the main application
module.exports = router;