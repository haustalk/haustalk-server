var exports = module.exports = {};

var OpenZWave = require('openzwave-shared');

var zwave = new OpenZWave('/dev/ttyUSB0', {
        logging: false,           // enable logging to OZW_Log.txt
        consoleoutput: false,     // copy logging to the console
        saveconfig: false,        // write an XML network layout
        driverattempts: 3,        // try this many times before giving up
        pollinterval: 500,        // interval between polls in milliseconds
        suppressrefresh: true,    // do not send updates if nothing changed
});
zwave.nodes = [];

//Callback for when a new node is added
zwave.on('node added', function(nodeid) {
	//Create a new node
	zwave.nodes[nodeid] = {
		manufacturer: '',
		manufacturerid: '',
		product: '',
		producttype: '',
		productid: '',
		type: '',
		name: '',
		loc: '',
		classes: {},
		ready: false,
	};
});

//Callback when a new value is added
zwave.on('value added', function(nodeid, comclass, value) {
	if (!zwave.nodes[nodeid]['classes'][comclass]) {
		zwave.nodes[nodeid]['classes'][comclass] = {};
	}
	zwave.nodes[nodeid]['classes'][comclass][value.index] = value;
});

//Callback for when a value is changed
zwave.on('value changed', function(nodeid, comclass, value) {
	zwave.nodes[nodeid]['classes'][comclass][value.index] = value;
});

//Callback for when a value is removed
zwave.on('value removed', function(nodeid, comclass, index) {
	if (zwave.nodes[nodeid]['classes'][comclass] && zwave.nodes[nodeid]['classes'][comclass][index]) {
		delete zwave.nodes[nodeid]['classes'][comclass][index];
	}
});

//Callback for when a node is ready
zwave.on('node ready', function(nodeid, nodeinfo) {
	zwave.nodes[nodeid]['manufacturer'] = nodeinfo.manufacturer;
	zwave.nodes[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
	zwave.nodes[nodeid]['product'] = nodeinfo.product;
	zwave.nodes[nodeid]['producttype'] = nodeinfo.producttype;
	zwave.nodes[nodeid]['productid'] = nodeinfo.productid;
	zwave.nodes[nodeid]['type'] = nodeinfo.type;
	zwave.nodes[nodeid]['name'] = nodeinfo.name;
	zwave.nodes[nodeid]['loc'] = nodeinfo.loc;
	zwave.nodes[nodeid]['ready'] = true;
	for (comclass in zwave.nodes[nodeid]['classes']) {
		switch (comclass) {
		case 0x25: // COMMAND_CLASS_SWITCH_BINARY
		case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
			zwave.enablePoll(nodeid, comclass);
			break;
		}
		var values = zwave.nodes[nodeid]['classes'][comclass];
	}
});

zwave.connect();

exports.zwave = function () {
	return zwave;
}