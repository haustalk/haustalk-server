var mongoose = require('mongoose');

//An access token for the oauth2 system
var AccessToken = new mongoose.Schema({
	//Id of use associated with client
    userId: {
        type: String,
        required: true
    },
    //Id of client requesting token
    clientId: {
        type: String,
        required: true
    },
    //Access token
    token: {
        type: String,
        unique: true,
        required: true
    },
    //Date the token was created
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AccessToken', AccessToken);