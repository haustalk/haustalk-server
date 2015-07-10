var express  = require('express');
var router   = express.Router();

var Dimmer = require('../../models/devices/dimmer');

//Routes for devices
router.route('/')
    //Get a list of all the devices
    .get(function(req, res) {
        //TODO: Get list of all devices, for now is just dimmers
        Dimmer.find(function(err, dimmers) {
        	//Check if error occured when getting dimmer
            if (err) {
                res.send(err);
            }
            //Return a json representation of the dimmer
            res.json(dimmers);
        });
    });

//Add dimmer routers to the device router
router.use('/dimmers', require('./devices/dimmer'));

module.exports = router;