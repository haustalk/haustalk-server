/***********************************
 * Contains the server logic for authorizing clients with oauth2
 *
 * Author: Nick DelBen
 * Created: July 11, 2015
 * Last Update: July 11, 2015
 *   - Created initially
 **********************************/

var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');

var config = require('../../core/config');
var UserModel = require('./models/user');
var ClientModel = require('./models/client');
var AccessTokenModel = require('./models/access_token');
var RefreshTokenModel = require('./models/refresh_token');

//Create a new oauth2 server
var server = oauth2orize.createServer();

//Exchange user credentials for an access token
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
	//Check for a user matching the specified username
    UserModel.findOne({ username: username }, function(err, user) {
    	//If there was an error searching for the user stop processing
        if (err) {
        	return done(err);
        }
        //If there is no user matching the specified username stop processing
        if (!user) {
        	return done(null, false);
        }
        console.log("\nHERE\n");
        //If the user specified an invalid password stop processing
        if (!user.checkPassword(password)) {
        	return done(null, false);
        }

        //Remove any existing refresh token associated with the specified user from the system
        RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
            if (err) return done(err);
        });
        //Remove any existing access token associated with the specified user from the system
        AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
            if (err) return done(err);
        });

        //Generate a key for the new token
        var tokenValue = crypto.randomBytes(32).toString('hex');
        //Generate a key for the refresh of the new token
        var refreshTokenValue = crypto.randomBytes(32).toString('hex');
        //Create a new access token for the specified user
        var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
        //Create a new refresh token for the specified user
        var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
        //Store the new access token in the system
        refreshToken.save(function (err) {
            if (err) {
            	return done(err);
            }
        });
        var info = {
        	scope: '*'
        }
        //Store the new refresh token in the system
        token.save(function (err, token) {
            if (err) {
            	return done(err);
            }
            done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:token-life') });
        });
    });
}));

//Exchange a refresh token for an access token
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
	//Search for a refresh token matcing the specified credentials
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
    	//If there is an error searching for the token stop processing
        if (err) {
        	return done(err);
        }
        //If there is no token found with the specified credentials stop processing
        if (!token) {
        	return done(null, false);
        }

        //Search for a user mayching the token credential specified
        UserModel.findById(token.userId, function(err, user) {
        	//If there is an error searching for the user stop processing
            if (err) {
            	return done(err);
            }
            //If there is no user found with the specified credentials stop processing
            if (!user) {
            	return done(null, false);
            }

            //Remove any existing refresh token associated with the specified user from the system
            RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });
            //Remove any existing access token associated with the specified user from the system
            AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });

            //Generate a key for the new access token
            var tokenValue = crypto.randomBytes(32).toString('hex');
            //Generate a key for the new refresh token
            var refreshTokenValue = crypto.randomBytes(32).toString('hex');
            //Create a new access token
            var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
            //Create a new refresh token
            var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
            //Add the new refresh token to the system
            refreshToken.save(function (err) {
                if (err) {
                	return done(err);
                }
            });
            var info = {
            	scope: '*'
            }
            //Ad the new access token to the system
            token.save(function (err, token) {
                if (err) {
                	return done(err);
                }
                done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
            });
        });
    });
}));

//The token andpoint
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]