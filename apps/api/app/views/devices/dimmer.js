var zwave = require('../../zwave.js').zwave();
var Dimmer = require('../../models/devices/dimmer');

//Returns a list of dimmers
exports.getAll = function (dimmers_in) {
	var result = [];
	for (var i = 0; i < dimmers_in.length; i++) {
		result.push(exports.getOne(dimmers_in[i]));
	}
    return result;
}

//Returns a single dimmer
exports.getOne = function (dimmer_in) {
	zwave.enablePoll(dimmer_in.node, 38);
	var result = {
		id: dimmer_in.id,
        name: dimmer_in.name,
        node: dimmer_in.node,
        online: false
    }
    //Check if the dimmer is associated with the zwave system
    if (typeof(zwave.nodes[dimmer_in.node]) != 'undefined') {
    	result.online = zwave.nodes[dimmer_in.node].ready;
    }
    //If the node is online get its current level
    if (result.online) {
    	result.level = zwave.nodes[dimmer_in.node]['classes'][38][0].value;
    }
    zwave.disablePoll(dimmer_in.node, 38);
    return result;
}

//Sets a zwave dimmer to the specified value
exports.setLevel = function (dimmer_in, level_in) {
	zwave.setValue(dimmer_in.node, 38, 1, 0, level_in);
}