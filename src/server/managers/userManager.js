// /**
//  * @file userManager.js
//  * @author Zishan Iqbal
//  * @description This file includes the CURD operations for the user Model.
//  */

// import User from './../models/user';
// import BaseManager from './../managers/baseManager';
// import AppUtils from './../utils/appUtils';

// class UserManager extends BaseManager {

// 	getEntity() {
// 		return User;
// 	}


// 	/**
// 	 * @desc - finds the user based on the users email
// 	 * @param String - email
// 	 * @return JSON - returns a JSON object of the user with the email
// 	 */
// 	findByToken(token) {
// 		return User.find({
// 			where: {
// 				password: token
// 			}
// 		});
// 	}

// 	findByEmail(email) {
// 		return User.find({
// 			where: {
// 				email: email
// 			}
// 		});
// 	}


// 	deleteByUserId(userId) {
// 		return User.destroy({
// 			where: {
// 				id: userId
// 			}
// 		});
// 	}

// 	list() {
// 		this.find()
// 			.then(function(users) {
// 				if (users && users.length > 0) {
// 					console.log('Email Address | First Name | Last Name');
// 					for (var i = 0; i < users.length; i++) {
// 						console.log(users[i].email + '|' + users[i].firstName + '|' + users[i].lastName);
// 					}
// 				} else {
// 					console.log('No users found');
// 				}
// 			});
// 	}

// 	// create (vals, callback) {
// // 		DbConnection.query('Insert INTO users (email, password) values(?,md5(?))', [vals.userEmail, 	vals.userPassword],callback);
// // 	}

// // 	load (email) {

// // 		// Users.findOne().then(function (user) {
// // 		// 	console.log(user.get('username'));
// // 		// });

// // 		// var query = 'SELECT * FROM users WHERE id='+id;

// // 		// return Sequelize.query(query, {type: Sequelize.QueryTypes.SELECT}) 
// // 		// 	DbConnection.query(query , function (err, results) {
// // 		// 	   	 return results;

// // 		// 	 });.

// // 		return User.find({
// // 			where: {
// // 				email: email
// // 			}
// // 		});
// // 	}

// 	createUser(email, firstName, lastName) {
// 		if (email) {
//       		this.findByEmail(email)
//         	.then(function(user) {
// 				console.log('email not exists');
//           if (!user) {  
// 			  console.log('user not exits');
// 			if (AppUtils.isValidEmail(email)) {
// 				this.create({
// 					firstName: firstName,
// 					lastName: lastName,
// 					email: email,
// 					password: AppUtils.generateAccessToken()
// 				}).then(function(user) {
// 					console.log('\nUser Access Token: '+user.password);
// 				});
// 				console.log('valid email');
// 			} else {
// 				console.log('\nError: Invalid Email address provided');
// 			}
// 		   } else{
//       			console.log('\nError: User already exists with this email. Please Try again with different Email.');
// 		   }
// 		 })
// 		} else {
//       console.log('\nPlease provide values in following order:\n fog-controller user -add <email> <firstName> <lastName>');
// 		}
// 	}

// 	removeUser(email) {
// 		if (email) {
// 			this.findByEmail(email)
// 				.then(function(user) {
// 					if (user) {
// 						user.destroy();
// 						console.log('User deleted');
// 					} else {
// 						console.log('Can not find user having "' + email + '" as email address');
// 					}
// 				})
// 		} else {
// 			console.log('Email address is required');
// 		}
// 	}

// 	generateToken(email) {
// 		if (email) {
// 			this.findByEmail(email)
// 				.then(function(user) {
// 					if (user) {
// 						user.password = AppUtils.generateAccessToken();
// 						console.log(user.password);
// 						user.save();
// 					} else {
// 						console.log('Can not find user having "' + email + '" as email address');
// 					}
// 				});
// 		} else {
// 			console.log('Email address is required');
// 		}
// 	}
// }

// const instance = new UserManager();
// export default instance;

/********************************************************** */
import Sequelize from 'sequelize';

import User from './../models/user';
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
        DbConnection.query('UPDATE users SET password= md5(?) WHERE md5(email)=?', [vals.userPassword, vals.token], callback);
    }

    findEncrypted(encrypted_id, res, callback) {

        DbConnection.query('SELECT * FROM users WHERE md5(email)=? LIMIT 1', encrypted_id, function(err, results) {
            if (err) {
                console.log('error.message:', err.message);
                return callback(err, null);
            }
            if (results.length > 0)
                return callback(err, true, null, res);
            else if (results.length < 1)
                return callback(err, false, null, res);
        });
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