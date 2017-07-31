var fs = require('fs');
var config = sails.config.caric;
module.exports = {

    createDataWithToken: function(data, cb) {
        var objectData = {
                email: data.email,
                passwordHash: data.passwordHash
            };

        return new Promise(function(resolve, reject) {
            // TODO вынести создание массива в отдельный функционал. Оставить тут только создание токена
            sails.jwt.encode(config.secret, objectData, function (err, token) {
                if (!err) {
                    resolve({
                        token: token,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
                        status: data.status,
                        language: data.language,
                        id: data.id
                    });
                } else {
                    reject(err)
                }
            })
        })
            .catch(function(err) {
                sails.log.error(err);
            });
    },
    getDataFromToken: function (token) {
        return new Promise(function(resolve, reject) {
            sails.jwt.decode(config.secret, token, function(e, d) {
                if(!e) resolve(d); else reject(e);
            })
        })
            .catch(function(err) {
                sails.log.error(err);
            });
    }
};