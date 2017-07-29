/**
 * AdvertsController
 *
 * @description :: Server-side logic for managing adverts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var currentName= 'AdvertsController';
module.exports = {
    get_image: function (req, res) {
        var path_arr = req.path.split('_');
        console.log(path_arr);

        res.sendfile('post_store/597a56a19579b86e16302b7e/357dbe0c-9772-46e1-b54f-686dad255ca4.jpg');

    },
    create: function (req, res) {
        sails.log(currentName + '.create');

        Services.getDataFromToken(req.body.token, function (err,data) {
            var saveObject = {
                user: data.email,
                filesCount: 0,
                status: 'create' // create, active, inactive, delete
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

        sails.models.adverts.findOne({id: req.headers.post_id}).exec(function(err, row){


                console.log('first ',row.filesCount)

                row.filesCount++;
                console.log('Second');
                req.file('image').upload({
                    dirname: dirToSave
                }, function (err, uploadedFiles) {
                    if (err) {
                        console.log(err);
                        return res.json({status: false});
                    }
                    console.log(row.filesCount, uploadedFiles)
                    return uploadedFiles.filename;
                    //row.save(function(err, row) { console.log(err, row) });
                    //return res.json({status: true, data: {filename: uploadedFiles.filename}});
                });
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

