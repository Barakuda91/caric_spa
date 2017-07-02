/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var currentName = 'UsersController';
var config = sails.config.caric;

module.exports = {
	auth: function (req,res) {
	    sails.log(currentName+'.auth');

		var data = {};

		Users.find()
			.then(function(users) {
				data.performers = users;
				console.log(users)
			});
		Params_settings._create();
    	res.end({res: 'ok'})
	}
};

