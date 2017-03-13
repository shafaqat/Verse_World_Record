/**
 * @file appUtils.js
 * @author Zishan Iqbal
 * @description This file includes the utility functions relevant to IOFog;
 */

import fs from 'fs';
import path from 'path';
import logger from './winstonLogs';

const isArray = (object) => {
    return Object.prototype.toString.call(object) === '[object Array]';
};
/**
 * @desc generates a random String of 64 size
 * @param - none
 * @return String - returns random string
 */
const generateAccessToken = function() {
    var token = '',
        i;
    for (i = 0; i < 8; i++) {
        token += ((0 + (Math.floor(Math.random() * (Math.pow(2, 31))) + 1).toString(16)).slice(-8)).substr(-8);
    }
    return token;
};
/**
 * @desc generates a random String of the size specified by the input param
 * @param Integer - size
 * @return String - returns random string
 */
const generateRandomString = function(size) {

    var randString = "";
    var possible = "2346789bcdfghjkmnpqrtvwxyzBCDFGHJKLMNPQRTVWXYZ";

    for (var i = 0; i < size; i++)
        randString += possible.charAt(Math.floor(Math.random() * possible.length));

    return randString;
};

const isFileExists = function(filePath) {
    if (path.extname(filePath).indexOf(".") >= 0) {
        if (fs.existsSync(filePath)) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
};

const isValidPort = function(port) {
    port = Number(port);
    if (Number.isInteger(port)) {
        if (port >= 0 && port < 65535)
            return true;
    }
    return false;
};

const isValidEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const convertRelativePathToAbsolute = function(filePath) {
    if (path.isAbsolute(filePath)) {
        return filePath;
    } else {
        return path.resolve(filePath);
    }
};

/**
 * @desc generates a random String of the size specified by the input param
 * @param Integer - size
 * @return String - returns random string
 */
const generateInstanceId = function(size) {

    var randString = "";
    var possible = "2346789bcdfghjkmnpqrtvwxyzBCDFGHJKLMNPQRTVWXYZ";

    for (var i = 0; i < size; i++)
        randString += possible.charAt(Math.floor(Math.random() * possible.length));

    return randString;
};

const getProperty = function(theObject, path, separator) {
    if (path) {
        try {
            separator = separator || '.';

            return path.
            replace('[', separator).replace(']', '').
            split(separator).
            reduce(
                function(obj, property) {
                    return obj[property];
                }, theObject
            );

        } catch (err) {
            return undefined;
        }
    } else {
        return null;
    }
};

const onCreate = function(params, paramName, errorMsg, callback, modelObject) {
    if (modelObject) {
        if (paramName) {
            params[paramName] = modelObject;
        }
        callback(null, params);

    } else {
        callback('error', errorMsg);
    }
};

const onFind = function(params, paramName, errorMsg, callback, modelObject) {
    if (modelObject) {
        if (paramName) {
            params[paramName] = modelObject;
        }
        callback(null, params);

    } else {
        callback('error', errorMsg);
    }
};

const onFindOptional = function(params, paramName, callback, modelObject) {
    if (modelObject && paramName) {
        params[paramName] = modelObject;
    }

    callback(null, params);
};

const onUpdate = function(params, errorMsg, callback, updatedModels) {
    if (updatedModels.length > 0) {
        callback(null, params);

    } else {
        callback('error', errorMsg);
    }
};

const onDelete = function(params, errorMsg, callback, deletedModels) {
    if (deletedModels <= 0) {
        callback('error', errorMsg);
    } else {
        callback(null, params);
    }
};

const onDeleteOptional = function(params, errorMsg, callback, deletedModels) {
    callback(null, params);
};

const sendResponse = function(response, err, successLabel, successValue, errorMessage) {
    var res = {
        'timestamp': new Date().getTime()
    };


    response.status(200);
    if (err) {
        logger.error(errorMessage);
        res.status = 'failure';
        res.errormessage = errorMessage;
    } else {
        logger.info("Success");
        res.status = 'ok';
        if (successLabel || successValue) {
            res[successLabel] = successValue;
        }
    }
    return response.send(res);
};


const sendMultipleResponse = function(response, err, successLabelArr, successValueArr, errorMessage) {
    var res = {
        'timestamp': new Date().getTime()
    };

    response.status(200);
    if (err) {
        logger.error(errorMessage);
        res['status'] = 'failure';
        res['errormessage'] = errorMessage;
    } else {
        res['status'] = 'ok';
        for (var i = 0; i < successValueArr.length; i++) {
            res[successLabelArr[i]] = successValueArr[i];
        }
    }
    response.send(res);
}

export default {
    isArray: isArray,
    isFileExists: isFileExists,
    isValidPort: isValidPort,
    isValidEmail: isValidEmail,
    generateAccessToken: generateAccessToken,
    generateRandomString: generateRandomString,
    convertRelativePathToAbsolute: convertRelativePathToAbsolute,
    generateInstanceId: generateInstanceId,
    getProperty: getProperty,
    onCreate: onCreate,
    onUpdate: onUpdate,
    onFind: onFind,
    onFindOptional: onFindOptional,
    onDelete: onDelete,
    onDeleteOptional: onDeleteOptional,
    sendResponse: sendResponse,
    sendMultipleResponse: sendMultipleResponse
};