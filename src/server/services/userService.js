import User from './../models/user';
import UserManager from '../managers/userManager';
import AppUtils from '../utils/appUtils';
import crypto from 'crypto';
import path from 'path';

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
    // var email = AppUtils.getProperty(params, props.email);
    // var password = AppUtils.getProperty(params, props.password);

    // console.log('in validate User');

    //  UserManager
    //   .findByEmail(email)
    //   .then(
    // 	  function(res){
    // 		  console.log(res);
    // 	  }
    //   );

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

const startPasswordRecovery = function(req, res) {
    console.log('starting recovery process for ' + req.params.encrypted_id);

    UserManager.find(req, res, function(err, isUserAuthenticated) {
        var user = req.body;
        if (isUserAuthenticated) {
            var encrypted = crypto.createHash('md5').update(user.userEmail).digest("hex");
            var url = 'http:/localhost:4000/reset-password/' + encrypted;
            AppUtils.sendResponse(res, err, 'url', url, 'use url to signup');
            console.log('url:', url);
        } else {
            AppUtils.sendResponse(res, err, 'authenticated', false, 'cant signup');
        }
    });
};

const endPasswordRecovery = function(req, res) {

    var encrypted_id = req.params.encrypted_id;

    UserManager.findEncrypted(encrypted_id, res, function(err, isUserAuthenticated) {
        if (isUserAuthenticated) {
            res.render('reset-password');
        } else {
            res.send('cant reset');
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
    endPasswordRecovery: endPasswordRecovery,
    resetPassword: resetPassword
};