
var currentName = 'Params_settingsController';
var config = sails.config.caric;
var fs  = require('fs');
module.exports = {

    /* DEPRECATED METHODS!!!!!!!!!!!!!*/
    add_localization_cities: function (req, res) {
        return
        fs.readFile('./db_dump/localization_cities_array.json', function(err, data) {

            var json_data = JSON.parse(data);

            sails.models.localization.create(json_data).exec(function (err) {
                res.json(err)
            })
        });
    },
    test: function (req, res) {
        return;
        fs.readFile('./db_dump/setting_cities_array.json', function(err, data) {

            var json_data = JSON.parse(data);

            sails.models.params_settings.find().exec(function (err, rows) {


                var json_data_ = Object.assign({regions:json_data},rows[0])

                sails.models.params_settings.destroy({}).exec(function (err, rows) {
                    sails.models.params_settings.create(json_data_).exec(function (err) {

                        if(!err) {
                            res.json({status: true})
                        } else {
                            res.json(err)

                        }
                    })

                })
            });
        });
    },
    /* DEPRECATED METHODS!!!!!!END!!!!*/


    /* DUMPING */
    // сохраняет дамп базы в файл_______________________________________________________________________________________
    save_dump_in_file: function(req, res) {
        sails.log(currentName + '.save_dump_in_file');
        var json_array = {};
        var modelsArray = [];

        for (var key in sails.models) {
            modelsArray.push(key);
        }

        var i = 0;

        (function d(i){
            getDb(modelsArray[i],function (err, rows) {
                if (!err) {
                    json_array[modelsArray[i]] = rows;

                    if (i !== modelsArray.length - 1) {
                        d(++i);
                    } else {
                        fs.writeFile('./db_dump/caric_spa.json',JSON.stringify(json_array), function(err) {
                            if (!err) {
                                res.json({status: true});
                            } else {
                                res.json({status: false, data: err});
                            }
                        })
                    }
                } else {
                    res.json({status: false, data: err});
                }
            });
        })(i);


        function getDb(dbName,cb) {
            sails.models[dbName].find().exec(cb);
        }
    },
    // восстанавливает дамп из файла в базу_____________________________________________________________________________
    restore_dump_from_file: function(req, res) {
        sails.log(currentName + '.restore_dump_from_file');
        fs.readFile('./db_dump/caric_spa.json', function(err, data) {
            if (!err) {
                var json_array = JSON.parse(data);
                var modelsArray = [];

                for (var key in json_array) {
                    modelsArray.push(key);
                }
                var i = 0;

                (function d(i){
                    setDataInDb(modelsArray[i], json_array[modelsArray[i]], function (err, rows) {
                        if (!err) {
                            if (i !== modelsArray.length - 1) {
                                d(++i);
                            } else {
                                res.json({status: true, data: modelsArray});
                            }
                        } else {
                            res.json({status: false, data: err});
                        }
                    });
                })(i);


                function setDataInDb(dbName,data,cb) {
                    sails.models[dbName].destroy({}).exec(function() {
                        sails.models[dbName].create(data).exec(cb)
                    });
                }
            } else {
                res.json({status: false, data: err});
            }
        })
    },
    /* DUMPING END*/

    // вернёт все данные из params_settings_____________________________________________________________________________
    get: function(req,res) {
        sails.log(currentName + '.get');
        switch (req.body.type) {

            // производители всех типов
            case "MAKERS_ALL": sails.models.makers.get(res); break;

            // производители определённого типа (wheels, tyres)
            case "MAKERS_BY_TYPE": break;

            // список регионов с городами
            case "REGIONS": break;

            default:
                sails.models.params_settings.find().limit(1).exec(function (err, row) {

                    if (!err) {
                        res.json({status: true, data: row[0]})
                    } else {
                        res.json({status: false, data: err})
                    }
                });
            break;
        }
    },

    // вернёт массив алиасов переводов__________________________________________________________________________________
    get_localization: function(req, res) {
        // TODO ввести типы локализации (general, regions, parameters_description, etc...)
        sails.log(currentName + '.get_localization');
        sails.models.localization.find().exec(function(err, row){
            var rows = Object.assign({},row[0],row[1])

            if (!err) {
                delete rows.id;
                delete rows.updatedAt;
                delete rows.createdAt;
                delete rows.type;
                res.json({status: true, data: rows})
            } else {
                res.json({status: false, data: err})
            }
        });
    },
    // сохраняет массив переводов_______________________________________________________________________________________
    set_localization: function(req, res) {
        // TODO ввесли логику, сделать сохранение по одному полю, массивом, или всё
        sails.log(currentName + '.set_localization');
        sails.models.localization.destroy({}).exec(function() {
            sails.models.localization.create(req.body).exec(function(err){
                if (!err) {
                    res.json({status: true})
                } else {
                    res.json({status: false, data: err})
                }
            });
        });
    }
}