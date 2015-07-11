var should = require("should");
var mongoose = require('mongoose');
var Account = require("../apps/auth/app/models/account.js");
var db;

describe('Account', function() {
    //Connect to the database for testing
    before(function(done) {
        db = mongoose.connect('mongodb://localhost/test');
            done();
    });

    //When finished testing disconnect from the database
    after(function(done) {
        mongoose.connection.close();
        done();
    });

    //Before each test create a new account to test with
    beforeEach(function(done) {
        var account = new Account({
            username: 'test_0001',
            password: 'pass_0001'
        });
        account.save(function(error) {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    //Test for duplicate usernames
    it('find a user by username', function(done) {
        Account.findOne({ username: 'test_0001' }, function(err, account) {
            account.username.should.eql('test_0001');
            console.log("   username: ", account.username);
            done();
        });
    });

    //After each test has completed remove the account
    afterEach(function(done) {
        Account.remove({}, function() {
            done();
        });
     });

});