//Grabs and streams an audio file
module.exports.getAudio = function (req, res, next) {
    //By default assume mp3 is type, but allow for ogg
    if (req.params.type !== 'ogg') {
        req.params.type = 'mp3';
    }
    //Start visualcaptcha
    var visualCaptcha = require('visualcaptcha')(req.session, req.query.namespace);
    //Stream the audio for the requested captcha
    visualCaptcha.streamAudio(res, req.params.type);
};

//Grabs and streams an image file
module.exports.getImage = function(req, res, next) {
    //Start visualCaptcha
    var visualCaptcha = require('visualcaptcha')(req.session, req.query.namespace);
    //Default is non-retina
    var usRetina = req.query.retina ? true : false;
    //Stream image for the requested captcha
    visualCaptcha.streamImage(req.params.index, res, isRetina);
};

//Start a new captcha and restart a captcha
module.exports.startRoute = function(req, res, next) {
    //Start visualCaptcha
    var visualCaptcha = require('visualcaptcha')(req.session, req.query.namespace);
    //Generate the specified number of captcha options
    visualCaptcha.generate(req.params.howmany);
    //Send the required data for the front end componant
    res.status(200).send(visualCaptcha.getFrontendData());
};

//Try to validate the captcha
// We need to make sure we generate new options after trying to validate, to avoid abuse
module.exports.trySubmission = function(req, res, next) {
    var namespace = req.query.namespace;
    var queryParams = [];
    var responseStatus;
    var responseObject;
    var imageAnswer;
    var audioAnswer;

    //Start visualCaptcha
    var visualCaptcha = require('visualcaptcha')(req.session, req.query.namespace);
    //Generate the required data for the front end componant
    var frontendData = visualCaptcha.getFrontendData();
    // Add namespace to query params
    if (namespace && namespace.length !== 0) {
        queryParams.push('namespace=' + namespace);
    }
    //Ensure visual captcha is initilized before the method is called
    if (typeof frontendData === 'undefined') {
        queryParams.push('status=noCaptcha');
        responseStatus = 404;
        responseObject = 'Not Found';
    } else {
        //Validate a submitted image
        if ((imageAnswer = req.body[frontendData.imageFieldName])) {
            //Check if user successfully completed the image captcha
            if (visualCaptcha.validateImage(imageAnswer)) {
                queryParams.push('status=validImage');
                responseStatus = 200;
            } else {
                queryParams.push('status=failedImage');
                responseStatus = 403;
            }
        //Validate submitted audio
        } else if ((audioAnswer = req.body[frontendData.audioFieldName])) {
            //Check if user successfully completed audio captcha, allow for case insensitivity
            if (visualCaptcha.validateAudio(audioAnswer.toLowerCase())) {
                queryParams.push('status=validAudio');
                responseStatus = 200;
            } else {
                queryParams.push('status=failedAudio');
                responseStatus = 403;
            }
        //User submitted invalid data
        } else {
            queryParams.push('status=failedPost');
            responseStatus = 500;
        }
    }

    if (req.accepts('html') !== undefined) {
        res.redirect('/?' + queryParams.join('&'));
    } else {
        res.status(responseStatus);
    }
};