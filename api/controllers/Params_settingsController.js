
var currentName = 'Params_settingsController';
var config = sails.config.caric;

module.exports = {

    create_db: function(req,res) {
        sails.log(currentName + '.create_db');

        // создаём тестовых пользователей
        sails.models.users.destroy({}).exec(function() {
            sails.models.users.create([{
                username: 'Barakuda',
                passwordHash: '46f94c8de14fb36680850768ff1b7f2a', // 123qwe
                email: 'barakudatm@gmail.com',
                firstName: 'Alexksandr',
                lastName: 'Istomin',
                status: 'admin'
            }, {
                username: 'Padavan',
                passwordHash: '46f94c8de14fb36680850768ff1b7f2a', // 123qwe
                email: 'padavan_z@gmail.com',
                firstName: 'Geka',
                lastName: 'Urchenko',
                status: 'admin'
            }, {
                username: 'Test',
                passwordHash: '46f94c8de14fb36680850768ff1b7f2a', // 123qwe
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
                wheelWidth: ['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','12.5'],
                tyreWidth: ['165','175','185','195','205','215','225','235','245','255','265','275','285','295','305','315','325','335'],
                tyreHeight: ['20','25','30','35','40','45','50','55','60','65','70','75','80','85','90'],
                PCD: ['4x98','4x100','4x108','4x110','4x114.3','5x100','5x108','5x110','5x112','5x114.3','5x115','5x120','5x120.65','5x125','5x127','6x114.3','6x127','6x139.7']
            }).exec(function (err, finn) {
                if (!err) {
                    sails.log('create_db: params_settings.create DONE')
                } else {
                    sails.log.error(err)
                }
            });
        });
        // заполняет коллекцию локализации
        sails.models.localization.destroy({}).exec(function() {
            sails.models.localization.create({
                'CAST': {
                    ru: 'литой',
                    en: 'cast',
                    ua: 'литий'
                },
                'FORGET': {
                    ru: 'кованый',
                    en: 'forget',
                    ua: 'кований'
                },
                'STAMPED': {
                    ru: 'штампованный',
                    en: 'stamped',
                    ua: 'штампований'
                },
                'MODULAR': {
                    ru: 'сборной',
                    en: 'modular',
                    ua: 'збірній'
                },
                'WINTER': {
                    ru: 'зима',
                    en: 'winter',
                    ua: 'зима'
                },
                'SUMMER': {
                    ru: 'лето',
                    en: 'summer',
                    ua: 'лiто'
                },
                'ALLSEASON': {
                    ru: 'всесезонная',
                    en: 'all-weather',
                    ua: 'всесезонна'
                },
                'ALUMINIUM': {
                    ru: 'алюминий',
                    en: 'aluminum',
                    ua: 'алюминiй'
                },
                'STEEL': {
                    ru: 'сталь',
                    en: 'steel',
                    ua: 'сталь'
                },
                'TITANIUM': {
                    ru: 'титан',
                    en: 'titanium',
                    ua: 'титан'
                },
                'OTHER': {
                    ru: 'другое',
                    en: 'other',
                    ua: 'iнше'
                },
                'ADD_ADVERT_PLEASE_TYPE': {
                    ru: 'тип товара',
                    en: 'advert type',
                    ua: 'тип товару'
                },
                LOGO_TAGLINE: {
                    ru: 'диски, шины: украины',
                    en: 'wheels and tyres of Ukraine',
                    ua: 'диски і шини з усієї країни'
                },
                INDEX_TAGLINE: {
                    ru: 'Диски Это 80% Вида Автомобиля (с) Генри Форд',
                    en: 'Machinery was invented by labor for labor-serving purposes. The wheel is the basis of the machine. (s) by Henry Ford',
                    ua: 'диски це 80% зовнiшного вигляду автiвки (с) Генрі Форд'
                },
                PLEASE_SELECT: {
                    ru: 'Выберите',
                    en: 'Please Select',
                    ua: 'Виберіть'
                },
                LOGIN_BUTTON_TITLEE:{
                    ru: 'Вход\Регистрация',
                    en: 'Login\Registration',
                    ua: 'Вхід\Реєстрація'
                },
                SEARCH:{
                    ru: 'поиск',
                    en: 'search',
                    ua: 'пошук'
                },
                WHEELS_ON_SALE: {
                    ru: 'диски в продаже',
                    en: 'wheels on sale',
                    ua: 'диски в продажу'
                },
                TYRES_ON_SALE: {
                    ru: 'шины в продаже',
                    en: 'tyres on sale',
                    ua: 'шина в продажу'
                },
                SPACES_ON_SALE: {
                    ru: 'проставки в продаже',
                    en: 'spaces on sale',
                    ua: 'проставки в продажу'
                },
                WHEELS: {
                    ru: 'диски',
                    en: 'wheels',
                    ua: 'диски'
                },
                TYRES: {
                    ru: 'шины',
                    en: 'tyres',
                    ua: 'шини'
                },
                SPACES: {
                    ru: 'проставки',
                    en: 'spaces',
                    ua: 'проставки'
                }
            }).exec(function (err, finn) {
                if (!err) {
                    sails.log('create_db: params_settings.create DONE')
                } else {
                    sails.log.error(err)
                }
            });
        });


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