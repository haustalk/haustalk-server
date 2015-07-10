var express = require('express');
var app = express();

app.use(require('./server'));

app.listen(8800);