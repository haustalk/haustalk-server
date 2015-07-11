var mongoose = require('mongoose');
var crypto = require('crypto');

//A user in the system
var User = new mongoose.Schema({
    //Username of the user
    username: {
        type: String,
        unique: true,
        required: true
    },
    //Hashed user password
    hashedPassword: {
        type: String,
        required: true
    },
    //Salt used to encrypt password
    salt: {
        type: String,
        required: true
    },
    //Date the user was created
    created: {
        type: Date,
        default: Date.now
    }
});

//Encrypt a users password to be stored in the system using pbkdf2
User.methods.encryptPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString();
};

//Return the unique id of a user
User.virtual('userId')
    .get(function () {
        return this.id;
    });

//Return the pasword of a user
User.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

//Check if a password matches the recorded password for a user
User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);