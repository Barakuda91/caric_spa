
var currentName = 'Params_settingsController';
var config = sails.config.caric;
var fs  = require('fs');
module.exports = {

    /* DEPRECATED METHODS!!!!!!!!!!!!!*/
    add_localization_cities: function (req, res) {
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

    get: function(req,res) {
        sails.log(currentName + '.get');
        sails.models.params_settings.find().limit(1).exec(function(err, row){
            console.log(err, row);
            if (!err) {
                res.json({status: true, data: row[0]})
            } else {
                res.json({status: false, data: err})
            }
        });
    },
    get_localization: function(req, res) {
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
    set_localization: function(req, res) {
        sails.log(currentName + '.set_localization');

        console.log(req);
        sails.models.localization.destroy({}).exec(function() {
            sails.models.localization.create(req.body).exec(function(err){
                if (!err) {
                    res.json({status: true})
                } else {
                    res.json({status: false, data: err})
                }
            });
        });
    },
    create_db: function(req,res) {
        sails.log(currentName + '.create_db');

        // создаём тестовых пользователей
        sails.models.users.destroy({}).exec(function() {

            sails.models.users.create([{
                username: 'Barakuda',
                passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123qwe
                email: 'barakudatm@gmail.com',
                firstName: 'Alexksandr',
                lastName: 'Istomin',
                status: 'admin'
            }, {
                username: 'Padavan',
                passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123qwe
                email: 'padavan_z@gmail.com',
                firstName: 'Geka',
                lastName: 'Urchenko',
                status: 'admin'
            }, {
                username: 'Test',
                passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // 123qwe
                email: 'test@gmail.com',
                firstName: 'Test',
                lastName: 'Test',
                status: 'user'
            }]).exec(function (err, finn) {
                if (!err) {
                    sails.log('create_db: users.create DONE')
                } else {
                    sails.log.error(err)
                }
            });
        });

        // заполняет коллекцию параметров
        sails.models.params_settings.destroy({}).exec(function() {
            sails.models.params_settings.create({
                productionYear: ['1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017'],
                currency: [
                    {
                        key: 'usd',
                        title: 'USD'
                    },
                    {
                        key: 'uah',
                        title: 'UAH'
                    }
                ],
                advertDeliveryMethod: [
                    {
                        key: 'delivery_by_country',
                        title: 'DELIVERY_BY_COUNTRY'
                    },
                    {
                        key: 'delivery_by_world',
                        title: 'DELIVERY_BY_WORLD'
                    },
                    {
                        key: 'take_yourself',
                        title: 'TAKE_YOURSELF'
                    }
                ],
                advertType: [
                    {
                        key: 'wheels',
                        title: 'WHEELS'
                    },
                    {
                        key: 'tyres',
                        title: 'TYRES'
                    },
                    {
                        key: 'spaces',
                        title: 'SPACES'
                    }
                ],
                diameter: ['12','13','14','15','16','17','18','19','20','21','22','23','24'],
                material: [
                    {
                        key: 'aluminum',
                        title: 'ALUMINIUM'
                    },
                    {
                        key: 'steel',
                        title: 'STEEL'
                    },
                    {
                        key: 'titanium',
                        title: 'TITANIUM'
                    },
                    {
                        key: 'other',
                        title: 'OTHER'
                    }
                ],
                wheelType: [
                    {
                        key: 'cast',
                        title: 'CAST'//'литой'
                    },
                    {
                        key: 'forged',
                        title: 'FORGET'//'кованый'
                    },
                    {
                        key: 'stamped',
                        title: 'STAMPED'//'штампованый'
                    },
                    {
                        key: 'modular',
                        title: 'MODULAR'//'сборной'
                    }
                ],
                wheelWidth: ['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5'],
                wheelEt: ['-55','-54','-53','-52','-51','-50','-49','-48','-47','-46','-45','-44','-43','-42','-41','-40','-39','-38','-37','-36','-35','-34','-33','-32','-31','-30','-29','-28','-27','-26','-25','-24','-23','-22','-21','-20','-19','-18','-17','-16','-15','-14','-13','-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55'],
                tyreType: [
                    {
                        key: 'winter',
                        title: 'WINTER'//'зима'
                    },
                    {
                        key: 'summer',
                        title: 'SUMMER'//'лето'
                    },
                    {
                        key: 'allseason',
                        title: 'ALLSEASON'//'всесезонная'
                    }
                ],
                tyreWidth: ['165','175','185','195','205','215','225','235','245','255','265','275','285','295','305','315','325','335'],
                tyreHeight: ['20','25','30','35','40','45','50','55','60','65','70','75','80','85','90'],
                tyreLoadIndex: ['60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129'],
                tyreSpeedIndex: ['J','K','L','M','N','P','Q','R','S','T','U','H','V','VR','W','Y','ZR'],
                pcd: ['4x98','4x100','4x108','4x110','4x114.3','5x100','5x108','5x110','5x112','5x114.3','5x115','5x120','5x120.65','5x125','5x127','6x114.3','6x127','6x139.7'],
                spacesType: [
                    {
                        key: 'simple',
                        title: 'SIMPLE'
                    },{
                        key: 'transitional',
                        title: 'TRANSITIONAL'
                    }
                ],
                fastenersType: [
                    {
                        key: 'stud',
                        title: 'STUD'
                    },{
                        key: 'screw',
                        title:'SCREW'
                    }
                ]
            }).exec(function (err, finn) {
                if (!err) {
                    sails.log('create_db: params_settings.create DONE')
                } else {
                    sails.log.error(err)
                }
            });
        });
        // заполняет коллекцию локализации
        // sails.models.localization.destroy({}).exec(function() {
        //     sails.models.localization.create({
        //         CAST: {
        //             ru: 'литой',
        //             en: 'cast',
        //             ua: 'литий'
        //         },
        //         FORGET: {
        //             ru: 'кованый',
        //             en: 'forget',
        //             ua: 'кований'
        //         },
        //         STAMPED: {
        //             ru: 'штампованный',
        //             en: 'stamped',
        //             ua: 'штампований'
        //         },
        //         MODULAR: {
        //             ru: 'сборной',
        //             en: 'modular',
        //             ua: 'збірній'
        //         },
        //         WINTER: {
        //             ru: 'зима',
        //             en: 'winter',
        //             ua: 'зима'
        //         },
        //         SUMMER: {
        //             ru: 'лето',
        //             en: 'summer',
        //             ua: 'лiто'
        //         },
        //         ALLSEASON: {
        //             ru: 'всесезонная',
        //             en: 'all-weather',
        //             ua: 'всесезонна'
        //         },
        //         ALUMINIUM: {
        //             ru: 'алюминий',
        //             en: 'aluminum',
        //             ua: 'алюминiй'
        //         },
        //         STEEL: {
        //             ru: 'сталь',
        //             en: 'steel',
        //             ua: 'сталь'
        //         },
        //         TITANIUM: {
        //             ru: 'титан',
        //             en: 'titanium',
        //             ua: 'титан'
        //         },
        //         OTHER: {
        //             ru: 'другое',
        //             en: 'other',
        //             ua: 'iнше'
        //         },
        //         ADD_ADVERT_PLEASE_TYPE: {
        //             ru: 'тип товара',
        //             en: 'advert type',
        //             ua: 'тип товару'
        //         },
        //         LOGO_TAGLINE: {
        //             ru: 'диски, шины: украины',
        //             en: 'wheels and tyres of Ukraine',
        //             ua: 'диски і шини з усієї країни'
        //         },
        //         INDEX_TAGLINE: {
        //             ru: 'диски Это 80% Вида Автомобиля (с) Генри Форд',
        //             en: 'machinery was invented by labor for labor-serving purposes. The wheel is the basis of the machine. (s) by Henry Ford',
        //             ua: 'диски це 80% зовнiшного вигляду автiвки (с) Генрі Форд'
        //         },
        //         PLEASE_SELECT: {
        //             ru: 'выберите',
        //             en: 'please Select',
        //             ua: 'виберіть'
        //         },
        //         ENTER:{
        //             ru: 'вход',
        //             en: 'enter',
        //             ua: 'вхiд'
        //         },
        //         FORGOT_PASSWORD:{
        //             ru: 'забыли пароль?',
        //             en: 'forgot password?',
        //             ua: 'забули пароль?'
        //         },
        //         FORGOT_PASSWORD_TEXT:{
        //             ru: 'укажите Email, который был указан при регистрации',
        //             en: 'enter the email that you provided during registration',
        //             ua: 'вкажіть Email, який був вказаний при реєстрації'
        //         },
        //         PASSWORD:{
        //             ru: 'пароль',
        //             en: 'password',
        //             ua: 'пароль'
        //         },
        //         REMEMBER_ME:{
        //             ru: 'Запомнить меня',
        //             en: '',
        //             ua: ''
        //         },
        //         USERNAME:{
        //             ru: 'имя пользователя',
        //             en: 'username',
        //             ua: 'iм\'я користувача'
        //         },
        //         REPEAT:{
        //             ru: 'повторите',
        //             en: 'repeat',
        //             ua: 'повторiть'
        //         },
        //         EMAIL:{
        //             ru: 'E-mail',
        //             en: 'E-mail',
        //             ua: 'E-mail'
        //         },
        //         LOGIN:{
        //             ru: 'вход',
        //             en: 'login',
        //             ua: 'вхід'
        //         },
        //         RECOLLECT:{
        //             ru: 'вспомнить',
        //             en: 'recollect',
        //             ua: 'згадати'
        //         },
        //         REGISTRATION:{
        //             ru: 'регистрация',
        //             en: 'registration',
        //             ua: 'реєстрація'
        //         },
        //         TO_REGISTER:{
        //             ru: 'загеристрироваться',
        //             en: 'to register',
        //             ua: 'зареєструватися'
        //         },
        //         ALREDY_EXISTS:{
        //             ru: 'уже существует',
        //             en: 'already exists',
        //             ua: 'вже існує'
        //         },
        //         SEND:{
        //             ru: 'выслать',
        //             en: 'send',
        //             ua: 'вислати'
        //         },
        //         SEARCH:{
        //             ru: 'поиск',
        //             en: 'search',
        //             ua: 'пошук'
        //         },
        //         WHEELS_ON_SALE: {
        //             ru: 'диски в продаже',
        //             en: 'wheels on sale',
        //             ua: 'диски в продажу'
        //         },
        //         TYRES_ON_SALE: {
        //             ru: 'шины в продаже',
        //             en: 'tyres on sale',
        //             ua: 'шина в продажу'
        //         },
        //         SPACES_ON_SALE: {
        //             ru: 'проставки в продаже',
        //             en: 'spaces on sale',
        //             ua: 'проставки в продажу'
        //         },
        //         WHEELS: {
        //             ru: 'диски',
        //             en: 'wheels',
        //             ua: 'диски'
        //         },
        //         TYRES: {
        //             ru: 'шины',
        //             en: 'tyres',
        //             ua: 'шини'
        //         },
        //         SPACES: {
        //             ru: 'проставки',
        //             en: 'spaces',
        //             ua: 'проставки'
        //         },
        //         PRICE: {
        //             ru: '',
        //             en: 'price',
        //             ua: ''
        //         },
        //         TYPE: {
        //             ru: '',
        //             en: 'type',
        //             ua: ''
        //         },
        //         WIDTH: {
        //             ru: '',
        //             en: 'width',
        //             ua: ''
        //         },
        //         HEIGHT: {
        //             ru: '',
        //             en: 'height',
        //             ua: ''
        //         },
        //         MAKER: {
        //             ru: '',
        //             en: 'maker',
        //             ua: ''
        //         },
        //         MODEL: {
        //             ru: '',
        //             en: 'model',
        //             ua: ''
        //         },
        //         DIAMETER: {
        //             ru: '',
        //             en: 'diamerer',
        //             ua: ''
        //         },
        //         MATERIAL: {
        //             ru: '',
        //             en: 'material',
        //             ua: ''
        //         },
        //         OFFSET: {
        //             ru: 'вылет',
        //             en: 'offset',
        //             ua: 'вилiт'
        //         },
        //         CENTER_HOLE: {
        //             ru: '',
        //             en: 'center hole',
        //             ua: ''
        //         },
        //         PCD: {
        //             ru: 'разболтовка',
        //             en: 'pitch center diameter',
        //             ua: ''
        //         },
        //         PROFILE_HEIGHT: {
        //             ru: 'высота профиля',
        //             en: 'profile height',
        //             ua: ''
        //         },
        //         RESIDUAL_TREAD: {
        //             ru: '',
        //             en: 'residual tread',
        //             ua: ''
        //         },
        //         LOAD_INDEX: {
        //             ru: 'индекс нагрузки',
        //             en: 'load index',
        //             ua: ''
        //         },
        //         SPEED_INDEX: {
        //             ru: 'индекс скорости',
        //             en: 'speed index',
        //             ua: ''
        //         }
        //     }).exec(function (err, finn) {
        //         if (!err) {
        //             sails.log('create_db: params_settings.create DONE')
        //         } else {
        //             sails.log.error(err)
        //         }
        //     });
        // });


        // sails.models.adverts.create([
        //     {
        //         wheelType: 'string', // тип диска (литой, штампованый ...)
        //         tyreType: 'summer',  // тип шины (лето, зима...)
        //         tyreMaker:  'string',// производитель шины
        //         wheelMaker: 'string', // производитель шины
        //         model: 'string',
        //         diameter: 'string', // диаметр диска, шины
        //         material: 'string',  // материал проставки
        //         wheelWidth: 'string', // ширина диска
        //         tyreWidth: 'string', // ширина шины
        //         PCD: 'string', // диаметр окружности точек крепежа
        //         tyreeight: 'string'// высота профиля шины
        //
        //     }
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/default.jpg',
        //         price: '300$',
        //         params: ['5x120',' 17','j9'],
        //         id: '125640'
        //     },
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/default.jpg',
        //         price: '140$',
        //         params: ['4x100',' 13','j5.5'],
        //         id: '125641'
        //     },
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/default.jpg',
        //         price: '230$',
        //         params: ['5x108',' 17','j10'],
        //         id: '125642'
        //     },
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/test_adv.jpg',
        //         price: '100$',
        //         params: ['5x120',' 15','j9'],
        //         id: '125643'
        //     },
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/default.jpg',
        //         price: '500$',
        //         params: ['5x114','16','j8'],
        //         id: '125644'
        //     },
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/default.jpg',
        //         price: '2500$',
        //         params: ['5x120','21','j11'],
        //         id: '125645'
        //     },
        //     {
        //         type: 'wheels',
        //         imgUrl: '/images/default.jpg',
        //         price: '404$',
        //         params: ['5x110','20','j10'],
        //         id: '125646'
        //     },
        // ]).exec(function (err, finn) {
        //     if (!err) {
        //         sails.log('create_db: adverts.create DONE')
        //     } else {
        //         sails.log.error(err)
        //     }
        // });

        res.json({res: 'ok'})
    }
}