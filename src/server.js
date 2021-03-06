import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';

import dbController from './server/controllers/dbController';
import baseController from './server/controllers/baseController';
import userController from './server/controllers/userController';
import stanzaController from './server/controllers/stanzaController';

var app = express();
var DbConnect = dbController.connect();
var i18n = require('i18n-abide');
var authFilter = function(req, res, next) {
    if (!req.session.email && req.originalUrl == '/panel')
        res.redirect('/login');
    else if (
        req.session.email &&
        (req.originalUrl == '/login' || req.originalUrl == '/reset-password' || req.originalUrl == '/forgot-password'))
        res.redirect('/panel');
    else
        next();
};

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(
    i18n.abide({
        supported_languages: ['en-US', 'ar'],
        default_lang: 'ar',
        translation_directory: path.resolve('./media/locale')
    })
);
app.use(express.static(__dirname + "/../dist"));
app.use(cookieParser());
app.use(session({
    secret: 'user_session_state',
    resave: true,
    saveUninitialized: true
}));
/**causing session to disturb**/
//cookie: {
//     secure: true,
//     maxAge: new Date(Date.now() + (60 * 60 * 1000))
// }

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(authFilter);

app.post('/login/validate', userController.login);
app.post('/logout', userController.destroySession);
app.post('/signup', userController.createUser);
app.post('/forgot-password', userController.startPasswordRecovery);
app.post('/reset', userController.resetPassword);
app.get('/getall/:id', userController.getall);
app.get('/stanza/get/:status/:currentPage/:search_query', stanzaController.getStanzas);
app.get('/stanza/get/:status/:currentPage/', stanzaController.getStanzas);
app.post('/stanza/create', stanzaController.createStanza);
app.post('/stanza/update', stanzaController.updateStanza);

app.get('/locale', baseController.locale);
app.get('/locale/:lang', baseController.changedLocale);
app.get('/logInStatus', baseController.sendStatus);

app.get('*', baseController.sendIndex);

app.listen(80, function() {
    console.log('server started at port 80 ...');
});
