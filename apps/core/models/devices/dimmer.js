var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DimmerSchema = new Schema({
    name: {
    	type: String,
    	required: true,
    	unique: true
    },
    node: {
    	type: Number,
    	required: true
    }
});

module.exports = mongoose.model('Dimmer', DimmerSchema);