/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var currentName = 'UsersController';
var config = sails.config.caric;

module.exports = {
	login: function (req,res) {
		sails.log(currentName+'.login');

		Users.findOne({passwordHash: req.body.password, email: req.body.email})
			.then(function(user) {
				if (user) {
					Services.createDataWithToken(user, function(err, data) {
						if (!err) {
							res.json({status: true, data: data})
						} else {
							res.json({status: false, data: err})
						}
					})
				}
				else {
					res.json({status: false, data: 'USER_OR_EMAIL_INCORRECT'})
				}
			});
	},
	register: function (req,res)  {
		sails.log(currentName+'.register');
		if( req.body.password !== req.body.confirmPassword) {
			res.json({status: false, data: 'INTRODUCED_PASSWORDS_ARE_NOT_EQUAL'});
			return;
		}

		Users.findOne({email: req.body.email})
			.then(function(user) {
				if(user) {
					res.json({status: false, data: 'THIS_EMAIL_ALREADY_EXISTS'});
				}
				else {
					Users.create({
						username: req.body.username,
						email: req.body.email,
						passwordHash: req.body.password
					}).then(function(rows) {
						Services.createDataWithToken(rows, function(err, data) {
							if (!err) {
								Mailer.sendWelcomeMail({email: req.body.email, name: req.body.username});
								res.json({status: true, data: data})
							} else {
								res.json({status: false, data: err})
							}
						})
					});

				}
			});

	},
	forgotPassword: function (req,res)  {
		sails.log(currentName+'.forgotPassword');

	},
	changeLanguage: function (req,res)  {
		sails.log(currentName+'.changeLanguage');
		Services.getDataFromToken(req.body.token, function(err, data) {
			Users.update({
				email: data.email,
				passwordHash: data.passwordHash
			},{
				language: req.body.language || config.defaultLanguage
			}).then(function(rows) {
				res.json({status: true})
			})
		})
	}
};

