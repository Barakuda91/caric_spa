/**
 * AdvertsController
 *
 * @description :: Server-side logic for managing adverts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var currentName= 'AdvertsController';
var fs = require('fs');
var resizeImg = require('resize-img');
module.exports = {
    get_image: function (req, res) {
        sails.log(currentName + '.get_image');
        var path_arr    = req.path.split('_');
        var size_arr    = path_arr[3].split('x');
        var width       = Number(size_arr[0]);
        var height      = Number(size_arr[1]);
        var resizeObj = {};

        if(width) {resizeObj.width = width;}
        if(height) { resizeObj.height = height;}

        var file_url = sails.config.caric.post_images_path+'/'+path_arr[1] + '/' + path_arr[2] + '.jpg';
        fs.stat(file_url, function(err) {
            // TODO сделать запрос в базы на предмет получения мейнтипа и разхмеров?
            if(err == null) {
                if(resizeObj.width || resizeObj.height) {
                    resizeImg(fs.readFileSync(file_url), resizeObj).then(function (buf) {
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        res.end(buf, 'binary');
                    });
                } else  {
                    res.sendfile(file_url);
                }
            } else {
                res.sendfile('assets/images/no_image.png');
            }
        });
    },
    // создает объявление со статусом "create"
    create: function (req, res) {
        sails.log(currentName + '.create');

        Services
            .getDataFromToken(req.body.token)
            .then(function (data) {
                var saveObject = {
                    user: data.email,
                    files: [],
                    status: 'create' // create, active, inactive, delete
                };

                sails.models.adverts.create(saveObject).exec(function (err, resData) {
                    if(!err) {
                        res.json({status: true, data: {post_id:resData.id}});
                    } else {
                        sails.log.error(err);
                        res.json({status: false});
                    }}
                );
            });
    },
    update_photo: function (req, res) {
        sails.log(currentName + '.update_photo');

        var dirToSave = sails.config.caric.post_images_path+'/'+req.headers.post_id;
        var filename = Number(req.headers.filename)

        if (filename >= 0 && filename <= 10) {
            Services
                .getDataFromToken(req.headers.token)
                .then(function (data) {
                    sails.models.adverts
                        .findOne({id: req.headers.post_id, user: data.email})
                        .exec(function (err, rows) {
                            if (!err) {
                                var fileData = req.file('image')._files[0].stream;
                                rows.files.push({
                                    position:   filename,
                                    width:      req.headers.width,
                                    height:     req.headers.height,
                                    originName: fileData.filename,
                                    contentType:fileData.headers['content-type'],
                                    size:       fileData.byteCount
                                });
                                req.file('image').upload({
                                    dirname: dirToSave,
                                    saveAs: filename + '.jpg'
                                }, function (err, uploadedFiles) {
                                    if (err) {
                                        console.log(err);
                                        return res.json({status: false, data: err});
                                    }
                                    rows.save()
                                    res.json({
                                        status: true,
                                        data: {fileUrl: '/image_' + req.headers.post_id + '_' + filename + '_150x_.jpg'}
                                    });
                                    return uploadedFiles.filename;
                                });
                            } else {
                                sails.log.error(err);
                                return res.json({status: false});
                            }
                        });
                });
        } else {
            sails.log.error('fileName must be integer 0...10 ');
            res.json({status: false});
        }
    },
    update: function (req, res) {
        sails.log(currentName + '.update');
        console.log(req.body);
        var saveObject = req.body;
        saveObject.status = 'active';
        delete saveObject.token;

        // TODO сделать все проверки на валидацию на стороне сервера

        // saveObject = {
        //     advertType: req.body.advertType,
        //     price: req.body.price,
        //     currency: req.body.currency,
        //     advertPhoneNumber: req.body.advertPhoneNumber,
        //     advertDescription: req.body.advertDescription,
        //     advertDeliveryMethod: req.body.advertDeliveryMethod,
        //
        // };
        //
        // switch (req.body.advertType) {
        //     case 'wheels':
        //         Object.assign(saveObject, {
        //             pcd: req.body.pcd,
        //             diameter: req.body.diameter,
        //             wheelType: req.body.wheelType,
        //             wheelWidth: req.body.wheelWidth,
        //             centerHole: req.body.centerHole,
        //             offset: req.body.offset,
        //             wheelMaker: req.body.wheelMaker,
        //             wheelModel: req.body.wheelModel
        //         });
        //         break;
        //     case 'tyres':
        //         Object.assign(saveObject, {
        //             tyreType: req.body.tyreType,
        //             tyreSpeedIndex: req.body.tyreSpeedIndex,
        //             diameter: req.body.diameter,
        //             tyreLoadIndex: req.body.tyreLoadIndex,
        //             tyreWidth: req.body.tyreWidth,
        //             productionYear: req.body.productionYear,
        //             tyreHeight: req.body.tyreHeight,
        //             treadRest_1: req.body.treadRest_1,
        //             treadRest_2: req.body.treadRest_2
        //         });
        //         break;
        //     case 'spaces':
        //         Object.assign(saveObject, {
        //             spacesType: req.body.spacesType,
        //             material :req.body.material,
        //             spacesCenterHole :req.body.spacesCenterHole,
        //             spacesWidth :req.body.spacesWidth,
        //             pcdSpacesFrom :req.body.pcdSpacesFrom,
        //             pcdSpacesTo :req.body.pcdSpacesTo
        //         });
        //         break;
        // }

        sails.models.adverts.update({id: saveObject.post_id}, saveObject).exec(function (err, resData) {
            if(!err) {
                res.json({status: true});
            } else {
                sails.log.error(err);
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
                    sails.log.error(err);
                    res.json({status: false})
                }
            });
        });
    },
    // срабатывает когда мы покидаем страницу подачи объявления
    leave: function(req, res) {
        sails.log(currentName + '.leave');
        Services
            .getDataFromToken(req.body.token)
            .then(function (data) {
                sails.models.adverts
                    .destroy({id: req.body.post_id, user: data.email, status: 'create'})
                    .exec(function (err,rows) {
                        if (!err && rows.length > 0) {
                            sails.rmdir(sails.config.caric.post_images_path + '/' + req.body.post_id, function (err) {
                                if (!err) {
                                    res.json({status: true})
                                } else {
                                    sails.log.error(err);
                                    res.json({status: false})
                                }
                            });
                        } else {
                            res.json({status: false})
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
                sails.log.error(err);
                res.json({status: false})
            }
        });
    }
};

