var express = require('express');
var passport = require('passport');

var oauth2 = require('../oauth2');

//Create a rounter for the oauth page
var router = express.Router();

//Forward posts to the oauth server
router.post('/token', oauth2.token);

//Show userinfo
router.get('/userInfo',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate a scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
    }
);

module.exports = router;