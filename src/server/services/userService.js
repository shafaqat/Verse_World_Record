import User from './../models/user';
import UserManager from '../managers/userManager';
import AppUtils from '../utils/appUtils';
import crypto from 'crypto';
import path from 'path';
import config from '../../config';
import transporter from '../utils/mailUtils';


var session;

const getUser = function(props, params, callback) {
    var userId = AppUtils.getProperty(params, props.userId);

    UserManager
        .load(userId)
        .then(AppUtils.onFind.bind(null, params, props.setProperty, 'User not Found', callback));
};

const createUser = function(req, res) {

    UserManager
        .find(req, res, function(err, isUserAuthenticated) {
            if (!isUserAuthenticated) {
                UserManager.createUser(req.body, function() {
                    console.log('user created');
                    AppUtils.sendResponse(res, err, 'signup', true, null);
                });
            } else {
                console.log('user not created');
                AppUtils.sendResponse(res, err, 'signup', false, null);
            }
        });
};

const validateUser = function(req, res) {
    UserManager.checkCredentials(req, res, startSession);

};
const startSession = function(err, isUserAuthenticated, req, res) {

    if (!err && isUserAuthenticated) {
        session = req.session;
        var user = req.body;

        session.userid = user.id;
        session.email = user.userEmail;
        session.type = user.type;

        console.log('creating session for the user:' + session.email);
        AppUtils.sendResponse(res, err, 'isloggedIn', true, null);
    } else {
        AppUtils.sendResponse(res, err, 'isloggedIn', false, 'authentation failed');
    }
};

const destroySession = function(req, res) {
    session = req.session;
    console.log('creating session for the user:' + session.email);
    session.destroy(function(err) {
        if (!err) {
            AppUtils.sendResponse(res, err, 'isloggedIn', false, 'authentation failed');
            console.log(err);
        } else {
            AppUtils.sendResponse(res, err, 'isloggedIn', true, null);
        }
    });
};


const sendMail = function(res, receiver) {

    var encrypted = crypto.createHash('md5').update(receiver).digest("hex");
    var url = 'http://54.190.16.0/reset-password';
    //to resolve the self signed certificate error
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Verse" <' + config.mailingEmailAddress + '>', // sender address
        to: receiver, // list of receivers
        subject: 'Verse - Password Recovery', // Subject line
        html: '<h1>Hello Judge !</h1><p>You can use this token ' + encrypted + ' by going to the page ' + url + ' to reset your Password.' // html body
    };


    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            AppUtils.sendResponse(res, error, 'mail sending error', true, 'contact web admin');
            return console.log("Error sending mail, message: ", error);
        }
        console.log('recovery message %s sent: %s', info.messageId, info.response);
        AppUtils.sendResponse(res, error, 'url', true, 'use url to signup');
    });
};

const startPasswordRecovery = function(req, res) {
    var user = req.body;
    console.log('starting recovery process for ' + user.userEmail);

    UserManager.find(req, res, function(err, isUserAuthenticated) {
        if (isUserAuthenticated) {
            sendMail(res, user.userEmail);
        } else {
            AppUtils.sendResponse(res, err, 'url', false, 'cant signup');
        }
    });
};

const resetPassword = function(req, res) {
    var user = req.body;
    console.log('recovery process ended for ' + user.token);

    UserManager.update(user, function(err, results) {
        if (results.affectedRows > 0)
            AppUtils.sendResponse(res, err, 'updateStatus', true, err);
        else
            AppUtils.sendResponse(res, err, 'updateStatus', false, err);
    });
};

export default {
    getUser: getUser,
    createUser: createUser,
    validateUser: validateUser,
    destroySession: destroySession,
    startPasswordRecovery: startPasswordRecovery,
    resetPassword: resetPassword
};