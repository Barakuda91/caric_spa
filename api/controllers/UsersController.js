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

		Users
			.findOne({passwordHash: req.body.password, email: req.body.email})
			.then(function(user) {
				if (user) {
					Services
						.createDataWithToken(user)
						.then(function(data) {
							res.json({status: true, data: data})
						}, function(err){
							res.json({status: false, data: err})
						});
				} else {
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
				} else {
					Users.create({
						username: req.body.username,
						email: req.body.email,
						passwordHash: req.body.password,
                        settings: {/* Default user settings all enabled */
                            show_disks: true,
                            show_tires: true,
                            show_spacers: true,
                            show_posts: true,
                            show_currency: 'usd',
                            firstname: '',
                            lastname: '',
                            telephone: '',
                            password: '',
                            confirm_password: ''
                        }
					}).then(function(rows) {
						Services
							.createDataWithToken(rows)
							.then(function(data) {
								Mailer.sendWelcomeMail({email: req.body.email, name: req.body.username});
								res.json({status: true, data: data})
							}, function(err) {
								res.json({status: false, data: err})
							});
					});
				}
			});

	},
	forgotPassword: function (req,res)  {
		sails.log(currentName+'.forgotPassword');

	},
	changeLanguage: function (req,res)  {
		sails.log(currentName+'.changeLanguage');
		Services
			.getDataFromToken(req.body.token)
			.then(function(data) {
				Users.update({
					email: data.email,
					passwordHash: data.passwordHash
				},{
					language: req.body.language || config.defaultLanguage
				}).then(function(rows) {
					res.json({status: true})
				})
			})
	},
    saveSettings: function (req,res)  {
        sails.log(currentName+'.saveSettings');
        sails.log(req.body);

		Services
			.getDataFromToken(req.body.token)
			.then(function(data) {
				var tempHash = data.passwordHash;
				if (req.body.newPasswordHash && req.body.newPasswordHash != data.passwordHash) {
                    tempHash = req.body.newPasswordHash;
				}

				Users.update({
					email: data.email,
					passwordHash: data.passwordHash
				},{
                    passwordHash: tempHash,
					settings: {
						show_disks : req.body.show_disks || false,
						show_tires : req.body.show_tires || false,
						show_spacers : req.body.show_spacers || false,
						show_posts : req.body.show_posts || false,
						show_currency : req.body.show_currency || 'seller',
						firstname : req.body.firstname || '',
						lastname : req.body.lastname || '',
						telephone : req.body.telephone || ''
					}
				}).then(function(rows) {
					res.json({status: true})
				})
			})
	}
};

