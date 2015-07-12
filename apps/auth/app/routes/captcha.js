var express = require('express');
var log = require('../../../core/log');
var captcha = require('../captcha');
var router = express.Router();

//Monitor when users try to submit a captcha
router.post('/try', captcha.trySubmission);

//Get a specific audio sptream package
//:type is optional and defaults to 'mp3' can also be 'ogg'
router.get('/audio', captcha.getAudio);
router.get('/audio/:type', captcha.getAudio);

//Get a specific image
//:index is required. Specifies the index of the image you wish to get
router.get('/image/:index', captcha.getImage);

//Get a new image from the captcha server
//:howmany required. Specifies the amount of images to generate
router.get('/start/:howmany', captcha.startRoute);

module.exports = router;