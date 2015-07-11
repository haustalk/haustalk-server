var winston = require('winston');
var config = require('./config');

//Return a wrapper for the winston logger
function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //using filename in log statements
    
    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize: true,
                level: config.get('log:winston-level'),
                label: path
            })
        ]
    });
}

module.exports = getLogger;