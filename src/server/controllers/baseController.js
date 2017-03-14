import path from 'path';
import AppUtils from './../utils/appUtils';
import fs from 'fs';


var baseController = {};
var session;

baseController.sendIndex = function(req, res) {
    res.render('index');
};

baseController.sendStatus = function(req, res) {
    session = req.session;
    res.status(200);
    if (session.email && session.type)
        AppUtils.sendResponse(res, null, 'LogIn', { 'status': true, 'type': session.type }, null);
    else
        AppUtils.sendResponse(res, null, 'LogIn', { 'status': false }, null);
};
baseController.locale = function(req, res) {
    res.header("Content-Type", "text/plain");
    // res.send(
    //     "You asked for: " + req.headers["accept-language"] + "\n" +
    //     // "We support: " + supported + "\n" +
    //     // "Our default is: " + locale.Locale["default"] + "\n" +
    //     "The best match is: " + req.locale + "\n"
    // );
    console.log('locale:', path.resolve('media/locale/' + lang + '/messages.json'));
    var locale = req.headers["accept-language"].split(',')[0].replace('-', '_');
    fs.readFile(path.resolve('media/locale/' + locale + '/messages.json'), 'utf8', function(err, contents) {
        if (!err) {
            res.json(JSON.parse(contents));
        }
    });
};
baseController.changedLocale = function(req, res) {
    var lang = req.params.lang;

    if (!lang.includes('ar') && !lang.includes('en_US'))
        lang = 'en_US';

    console.log('changedLocale: ', path.resolve('media/locale/' + lang + '/messages.json'));
    fs.readFile(path.resolve('media/locale/' + lang + '/messages.json'), 'utf8', function(err, contents) {
        if (!err) {
            res.json(JSON.parse(contents));
        }
    });
};
module.exports = baseController;