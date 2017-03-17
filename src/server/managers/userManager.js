import User from './../models/user';
// import Sequelize from 'sequelize';
// import sequelize from './../utils/sequelize';

import BaseManager from './baseManager';

import dbController from './../controllers/dbController';
var DbConnection = dbController.connection;

class userManager extends BaseManager {
    createUser(vals, callback) {
        console.log(vals);
        DbConnection.query('Insert INTO users (email, password) values(?,md5(?))', [vals.userEmail, vals.userPassword], callback);
    }

    update(vals, callback) {
        DbConnection.query('UPDATE users SET password = md5(?) WHERE md5(email)=?', [vals.userPassword, vals.token], callback);
    }

    find(req, res, callback) {
        var vals = req.body;

        DbConnection.query('SELECT * FROM users WHERE email=? LIMIT 1', vals.userEmail, function(err, results) {
            if (err) {
                console.log('error.message:', err.message);
                return callback(err, null);
            }
            if (results.length > 0)
                return callback(err, true, req, res);
            else if (results.length < 1)
                return callback(err, false, req, res);
        });
    }

    checkCredentials(req, res, callback) {
        var vals = req.body;

        DbConnection.query('SELECT * FROM users WHERE email=? AND password=md5(?)', [vals.userEmail, vals.userPassword], function(err, results) {
            if (err) {
                console.log('error.message:', err.message);
                return callback(err, null);
            }
            console.log('results:', results);
            if (results.length > 0) {
                req.body.id = results[0].id;
                req.body.type = results[0].type;
                return callback(err, true, req, res);
            } else if (results.length < 1)
                return callback(err, false, req, res);
        });

    }
}



const instance = new userManager();
export default instance;