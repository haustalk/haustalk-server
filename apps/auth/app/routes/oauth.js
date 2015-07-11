var express = require('express');
var passport = require('passport');

var oauth2 = require('../oauth2');

//Create a rounter for the oauth page
var router = express.Router();

//Forward posts to the oauth server
router.post('/token', oauth2.token);

module.exports = router;