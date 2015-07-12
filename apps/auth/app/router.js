var express = require('express');
var router = express.Router();

//Include the routes for the html front end
router.use('/', require('./routes/users'));

//Include routes for the oauth handler
router.use('/oauth', require('./routes/oauth'));

//Include routes for the captcha handler
router.use('/captcha', require('./routes/captcha'));

//Export the authentication app for use an the main application
module.exports = router;