/***********************************
 * Represents a zwave dimmer
 *
 * Author: Nick DelBen
 * Created: July 11, 2015
 * Last Update: July 11, 2015
 *   - Created initially
 **********************************/

var mongoose = require('mongoose');
var zwave = require('../../zwave');

var DimmerSchema = new mongoose.Schema({
	//Name for the dimmer
    name: {
    	type: String,
    	required: true,
    	unique: true
    },
    //Zwave dimmers can be uniquely identified by their node id in openzwave
    node: {
    	type: Number,
    	required: true
    }
});


//Validata a specified name
DimmerSchema.path('name').validate(function (name_in) {
	//Check that the name was not undefined
	if (typeof(name_in) == 'undefined') {
		return false;
	}
	//Check that the name is a valid length
	if (name_in.length < 3 | name_in.length > 128) {
		return false;
	}
	return true;
}, 'Invalid name specified');

/*****************
* Set the brightness of the actual dimmer on the zwave network
* @param level_in the new level for the diummer brightness
*****************/
DimmerSchema.virtual('level').set(function (level_in) {
	//Ensure the specified value is a number
	if (isNaN(level_in)) {
		return false;
	}
	zwave.setValue(this.node, 38, 1, 0, level_in);
});

/*****************
* Get the current status of the light
*****************/
DimmerSchema.virtual('online').get(function () {
	//Check if ther eis any recordof the device in the database
	if (typeof(zwave.nodes[this.node]) == 'undefined') {
		return false;
	}
	//Return the state of the dimmer
    return zwave.nodes[dimmer_in.node].ready;
});

/*****************
* Get the current brightness level of the dimmer
*****************/
DimmerSchema.virtual('level').get(function () {
	return zwave.nodes[this.node]['classes'][38][0].value;
});

module.exports = mongoose.model('Dimmer', DimmerSchema);