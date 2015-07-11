var nconf = require('nconf');

//Take environment variables into the configuration
nconf.argv()
    .env()
    .file({ file: './config.json' });

//The export the modified configuration document
module.exports = nconf;