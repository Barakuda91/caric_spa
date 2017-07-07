/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var currentName = 'UsersController';
var config = sails.config.caric;
var jwt = require('json-web-token');

module.exports = {
	login: function (req,res) {
	    sails.log(currentName+'.auth');
		console.log(req.body)
		var data = {};

		Users.findOne({passwordHash: req.body.password, email: req.body.email})
			.then(function(user) {
				if(user) {
					jwt.encode(config.secret, {email:user.email, password: user.password}, function (err, token) {
						if(!err) {
							res.json({status: true, data: {
								token: 		token,
								firstName: 	user.firstName,
								lastName: 	user.lastName,
								status: 	user.status,
								id: 		user.id
							}})
						} else {
							res.json({status: false, data: 'ERROR_WITH_CREATE_TOKEN'})
						}
					})
				}
				else {
					res.json({status: false, data: 'USER_NOT_FOUND'})
				}
			});
	},
	register: function () {
		sails.log(currentName+'.register');
	},
	forgotPassword: function () {
		sails.log(currentName+'.forgotPassword');

	}
};

