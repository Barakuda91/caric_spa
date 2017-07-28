/**
 * AdvertsController
 *
 * @description :: Server-side logic for managing adverts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var currentName = 'AdvertsController';
module.exports = {
	index: function (req, res) {
	    console.log('HERE222');
    },
    create: function (req, res) {
        sails.log(currentName + '.create');

        var user = Services.getDataFromToken(req.body.token, function (err,data) {
            var saveObject = {
                user: data.email,
                status: 'crate' // create, active, inactive, delete
            }

            sails.models.adverts.create(saveObject).exec(function (err, resData) {
                if(!err) {
                    res.json({status: true, data: {post_id:resData.id}});
                } else {
                    res.json({status: false});
                }}
            );
        });
    },
    update_photo: function (req, res) {
        sails.log(currentName + '.update_photo');
// TODO сделать удаление про коле или ерроре, сделать переименование файлов при записи
        var dirToSave = sails.config.caric.post_images_path+'/'+req.headers.post_id;

        req.file('image').upload({
            dirname: dirToSave
            // adapter: require('skipper-gridfs'),
            // uri: "mongodb://root:qwe123@localhost:27017/caric_spa"
        }, function (err, uploadedFiles) {
            if (err) {
                console.log(err)
                return res.json({status: false});
            }
            return res.json({status: true, data: {filename: uploadedFiles.filename}});
        });
    },
    update: function (req, res) {
        sails.log(currentName + '.update');
        console.log(req.body);
        
        var saveObject = {
            advertType: req.body.advertType,
            price: req.body.price,
            currency: req.body.currency,
            advertPhoneNumber: req.body.advertPhoneNumber,
            advertDescription: req.body.advertDescription,
            advertDeliveryMethod: req.body.advertDeliveryMethod,

        };

        switch (req.body.advertType) {
            case 'wheels':
                Object.assign(saveObject, {
                    pcd: req.body.pcd,
                    diameter: req.body.diameter,
                    wheelType: req.body.wheelType,
                    wheelWidth: req.body.wheelWidth,
                    centerHole: req.body.centerHole,
                    offset: req.body.offset,
                    wheelMaker: req.body.wheelMaker,
                    wheelModel: req.body.wheelModel
                });
            break;
            case 'tyres':
                Object.assign(saveObject, {
                    tyreType: req.body.tyreType,
                    tyreSpeedIndex: req.body.tyreSpeedIndex,
                    diameter: req.body.diameter,
                    tyreLoadIndex: req.body.tyreLoadIndex,
                    tyreWidth: req.body.tyreWidth,
                    productionYear: req.body.productionYear,
                    tyreHeight: req.body.tyreHeight,
                    treadRest_1: req.body.treadRest_1,
                    treadRest_2: req.body.treadRest_2
                });
            break;
            case 'spaces':
                Object.assign(saveObject, {
                    spacesType: req.body.spacesType,
                    material :req.body.material,
                    spacesCenterHole :req.body.spacesCenterHole,
                    spacesWidth :req.body.spacesWidth,
                    pcdSpacesFrom :req.body.pcdSpacesFrom,
                    pcdSpacesTo :req.body.pcdSpacesTo
                });
            break;
        }
        sails.models.adverts.create(saveObject).exec(function (err, resData) {
            if(!err) {
                res.json({status: true});
            } else {
                res.json({status: false});
            }}
        );

    },

    get: function (req, res) {
        sails.log(currentName + '.get');
        sails.models.adverts.native(function(err, collection) {
            if (err) {
                res.json({status: false, data: err});
            }
            var filters = {};
            if (sails.config.caric.advertSettingParamFilters[req.body.filters]) {
                for (var key in sails.config.caric.advertSettingParamFilters[req.body.filters]) {
                    filters[sails.config.caric.advertSettingParamFilters[req.body.filters][key]] = true;
                }
            }
            collection.find({}, filters).toArray(function (err, rows) {
                if (!err) {
                    res.json({status: true, data: rows})
                } else {
                    res.json({status: false, data: err})
                }
            });
        });
    },

    get_one: function (req, res) {
        sails.log(currentName + '.get_one');
        sails.models.adverts.findOne({id: req.body.id}).exec(function(err, rows) {
            if (!err) {
                res.json({status: true, data: rows})
            } else {
                res.json({status: false, data: err})
            }
        });
    }
};

