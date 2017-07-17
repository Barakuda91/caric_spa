var fs = require('fs');
var jwt = require('json-web-token');
var config = sails.config.caric;
module.exports = {

    createDataWithToken: function(data, cb) {
        var objectData = {
                email: data.email,
                passwordHash: data.passwordHash
            };
            jwt.encode(config.secret, objectData, function (err, token) {
                if (!err) {
                    cb(null, {
                        token: token,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        status: data.status,
                        language: data.language,
                        id: data.id
                    });
                } else {
                    cb(err, null)
                }
            })
    },
    getDataFromToken: function (token, cb) {
        jwt.decode(config.secret, token,cb)
    }
};