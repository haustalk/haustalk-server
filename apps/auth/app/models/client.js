var mongoose = require('mongoose'); //Mongo interface

//Represents a client in the oauth2 system
var Client = new mongoose.Schema({
	//Name of the client
    name: {
        type: String,
        unique: true,
        required: true
    },
    //Id of the client
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    //Secret code of the client
    clientSecret: {
        type: String,
        required: true
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Client', Client);