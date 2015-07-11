var mongoose = require('mongoose');

//A refresh token for the oauth2 system
var RefreshToken = new mongoose.Schema({
	//Id of the user requesting the refresh
    userId: {
        type: String,
        required: true
    },
    //Id if oauth client requesting token
    clientId: {
        type: String,
        required: true
    },
    //Token information
    token: {
        type: String,
        unique: true,
        required: true
    },
    //Date token was created
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', RefreshToken);