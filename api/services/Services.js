var fs = require('fs');
var config = sails.config.caric;
module.exports = {

    createDataWithToken: function(data, cb) {
        var objectData = {
                email: data.email,
                passwordHash: data.passwordHash
            };
        sails.jwt.encode(config.secret, objectData, function (err, token) {
                if (!err) {
                    cb(null, {
                        token: token,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
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
        sails.jwt.decode(config.secret, token,cb)
    }
};