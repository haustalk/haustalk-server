/***********************************
 * Contains the authorization logic for authorizing clients
 *
 * Author: Nick DelBen
 * Created: July 11, 2015
 * Last Update: July 11, 2015
 *   - Created initially
 **********************************/

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var config = require('../../core/config');
var UserModel = require('./models/user');
var ClientModel = require('./models/client');
var AccessTokenModel = require('./models/access_token');
var RefreshTokenModel = require('./models/refresh_token');

//Takes in submitted credentials and checks if they match any client in the system
passport.use(new BasicStrategy(
    function(username, password, done) {
        //Search the database for the client
        ClientModel.findOne({ clientId: username }, function(err, client) {
            //If there is an error finding the client stop processing
            if (err) {
                return done(err);
            }
            //If the user is not a valid client stop processing
            if (!client) {
                return done(null, false);
            }
            //If the user submitted incorrect credentials stop processing
            if (client.clientSecret != password) {
                return done(null, false);
            }
            //User submitted valid credentials
            return done(null, client);
        });
    }
));

//Log the user into the system using the provided client token information
passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        //Search the sytem for the client
        ClientModel.findOne({ clientId: clientId }, function(err, client) {
            //If there is an error finding the client stop processing
            if (err) {
                return done(err);
            }
            //If the client is not a valid client stop processing
            if (!client) {
                return done(null, false);
            }
            //If the user submitted incorrect credentials stop processing
            if (client.clientSecret != clientSecret) {
                return done(null, false);
            }
            //User submitted valid client token credentials
            return done(null, client);
        });
    }
));

//Log the user in using the provided oauth2 token
passport.use(new BearerStrategy(
    function(accessToken, done) {
        //Check if the access token matches any recored token in the system
        AccessTokenModel.findOne({ token: accessToken }, function(err, token) {
            //If there is an error searching for the token stop processing
            if (err) {
                return done(err);
            }
            //If there was no valid token found stop processing
            if (!token) {
                return done(null, false);
            }
            //If the token is expired stop processing
            if(Math.round((Date.now()-token.created)/1000) > config.get('security:token-life') ) {
                AccessTokenModel.remove({ token: accessToken }, function (err) {
                    if (err) return done(err);
                });
                return done(null, false, { message: 'Token expired' });
            }
            //Find the user associated with token
            UserModel.findById(token.userId, function(err, user) {
                //If there is an error finding the user stop processing
                if (err) {
                    return done(err);
                }
                //If there was no user assicuated with the token stop processing
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                var info = {
                    scope: '*'
                }
                //User was successfully found with valid token
                done(null, user, info);
            });
        });
    }
));