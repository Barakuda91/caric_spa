/**
 * AdvertsController
 *
 * @description :: Server-side logic for managing adverts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var currentName= 'AdvertsController';
var fs = require('fs');
var resizeImg = require('resize-img');
var ObjectId = require('mongodb').ObjectID;
var gm = require('gm');
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
      // TODO сделать запрос в базы на предмет получения мейнтипа и размеров?
      if(err == null) {
        if(resizeObj.width || resizeObj.height) {
          /**
           * 2698.493ms
           * 2794.789ms
           * 3158.242ms
           * 3145.601ms
           * 3145.601ms
           */
          // resizeImg(fs.readFileSync(file_url), resizeObj).then(function (buf) {
          //   console.timeEnd('photo_4');
          //   sendPhoto(buf)
          // });


          /**
           * 386.257ms
           * 458.147ms
           * 667.382ms
           * 570.981ms
           * 424.610ms
           * в 5,6 раз быстрее
           */
          gm(file_url)
            .resize(resizeObj.width, resizeObj.height)
            .toBuffer('JPEG',function (err, buf) {
              res.end(buf, 'binary');
            })

        } else  {
          fs.readFile(file_url, function(err,buf) {
            sendPhoto(buf)
          });
        }
      } else {
        fs.readFile('assets/images/no_image.png', function(err,buf) {
          sendPhoto(buf)
        });
      }
    });
    function sendPhoto(buf) {
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(buf, 'binary');
    }
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
  checkUrl: function (req, res) {
    sails.log(currentName + '.checkUrl',req.body);

    sails.models.adverts
      .find({spawnType: 'olx', origin: req.body.origin})
      .exec(function(err, rows) {
        if(err) {sails.log.error(err); return res.json({status: false, data: {code: 'SERVER_ERROR'}});}
        return res.json({status: true, isSuchAdv: rows.length});
      })
  },
  parserCreateAdv: function(req, res) {
    sails.log(currentName + '.parserCreateFdv',req.body);

    sails.models.adverts
      .create(req.body)
      .exec(function (err, resData) {
        console.log(resData.id)
        sails.models.adverts
          .update({id: resData.id}, {post_id: resData.id,spawnType: 'olx'})
          .exec(function (err, resData) {
            if(!err) {
              res.json({status: true});
            } else {
              sails.log.error(err);
              res.json({status: false});
            }}
          );

      });
  },
  get: function (req, res) {
    sails.log(currentName + '.get',req.body);

    Adverts.native(function(err, collection) {
      if(err) {sails.log.error(err); return res.json({status: false, data: {code: 'SERVER_ERROR'}});}

      var filters = {};
      var requestParams = {};
      var limit = (!isNaN(Number(req.body.limit))) ? Number(req.body.limit): 0;
      var skip  = (!isNaN(Number(req.body.skip)))  ? Number(req.body.skip):  0;
      var sort  = (Number(req.body.sort) > 0 )     ? 1 : -1;


      if (sails.config.caric.advertSettingParamFilters[req.body.filters]) {
        for (var key in sails.config.caric.advertSettingParamFilters[req.body.filters]) {
          filters[sails.config.caric.advertSettingParamFilters[req.body.filters][key]] = true;
        }
      }
      collection
        .find(req.body.search)
        .limit(limit)
        .skip(skip)
        .sort({'createdAt': sort})
        .toArray(function (err, rows) {
          if(err) {sails.log.error(err); return res.json({status: false, data: {code: 'SERVER_ERROR'}});}

          if(req.body.preview) {
            rows.forEach(function(el,index) {
              if(el.files[0] && el.files[0].url) {
                rows[index].image = el.files[0].url;
              } else {
                rows[index].image = '/image_'+el._id+'_0_265x0.jpg';
              }
            });
          }
          res.json({status: true, data: rows})
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
    sails.log(currentName + '.get_one',req.body);

    Adverts.native(function(err, collection) {
      if(err) {sails.log.error(err); return res.json({status: false, data: {code: 'SERVER_ERROR'}});}

      console.log(new ObjectId(req.body.id));
      collection
        .findOne({post_id: req.body.id}/*, Services.getFiltersArray('getOneAdvert')*/)
        .then(function (rows) {
          var files = [];
          if(rows.files) {

            rows.files.forEach(function(el,index) {
              var image;
              if(el.url) {
                image = el.url;
              } else {
                image = '/image_'+rows._id+'_'+el.position+'_'+el.width+'x'+el.height+'.jpg';
              }
              files.push({
                image: image,
                width: el.width, // TODO ???
                height: el.height, // TODO ???
                position: el.position // TODO ???
              });
            });
          }
          rows.files = files;
          Users.findOne({email: rows.user}).exec(function(err, user) {
            rows.author = user.username || user.email

            console.log(rows);
            res.json({status: true, data: rows})
          });
        })
        .catch(function(err){
          if(err) {sails.log.error(err); return res.json({status: false, data: {code: 'SERVER_ERROR'}});}
        });
    });
  }
};

