import path from 'path';

import userManager from './../managers/userManager';
import userService from './../services/userService';
import AppUtils from './../utils/appUtils';

import async from 'async';

const login = function(req, res) {
    userService.validateUser(req, res);
};
const createUser = function(req, res) {
    userService.createUser(req, res);
};
const destroySession = function(req, res) {
    userService.destroySession(req, res);
};
const startPasswordRecovery = function(req, res) {
    userService.startPasswordRecovery(req, res);
};
const resetPassword = function(req, res) {
    userService.resetPassword(req, res);
};

const getall = function(req, res) {

    var params = {};
    params.bodyParams = req.params;

    var userProps = {
        userId: 'bodyParams.id',
        setProperty: 'userData'
    };

    async.waterfall([
        async.apply(userService.getUser, userProps, params)
    ], function(err, result) {
        AppUtils.sendResponse(res, err, 'test-result', params, result);
    });
};

export default {
    login: login,
    createUser: createUser,
    destroySession: destroySession,
    startPasswordRecovery: startPasswordRecovery,
    resetPassword: resetPassword,
    getall: getall
};