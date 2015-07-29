var express  = require('express');
var router   = express.Router();

var Dimmer = require('../../../../core/models/devices/dimmer');

//Routes for dimmers
router.route('/')
	//A new dimmer is posted
    .post(function(req, res) {    
        //Create a new dimmer for storage
        var dimmer = new Dimmer();
        //Set the dimmer fields
        dimmer.name = req.body.name;
        dimmer.node = req.body.node;
        //Save the new dimmer
        dimmer.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.status(201).json(dimmer);
        });
    })
    //Get a list of all the dimmers
    .get(function(req, res) {
        Dimmer.find(function(err, dimmers) {
        	//Check if error occured when getting dimmer
            if (err || dimmers == 'undefined' || dimmers == null) {
                res.send(404);
                return;
            }
            //Return a json representation of the dimmer
            res.json(dimmers);
        });
    });

router.route('/:dimmer_id')
    //Get a specific dimmer by it's id
    .get(function(req, res) {
        Dimmer.findById(req.params.dimmer_id, function(err, dimmer) {
            //Check if error occured when finding dimmer
            if (err || dimmer == 'undefined' || dimmer == null) {
                res.send(404);
                return;
            }
            res.json(dimmer);
        });
    })
    //Make changes to an existing instance a dimmer
    .put(function(req, res) {
        Dimmer.findById(req.params.dimmer_id, function(err, dimmer) {
            //Check if error occured when finding dimmer
            if (err) {
                res.status(400).send(err);
            }
            //Set the new values
            dimmer.level = req.body.level;
            dimmer.name = req.body.name;
            //Save the modifications to the dimmer
            dimmer.save(function(err) {
            	if (err) {
            		res.status(400).send(err);
            	}
            });
            res.send(204);
        });
    });

module.exports = router;