
module.exports.routes = {

  'get /test': 'Params_settingsController.add_localization_cities',
  '/': {
    view: 'homepage'
  },
  'get /list*': {
    view: 'homepage'
  },
  'post /api/localization': function (req, res) {
    sails.log(req.method,' /api/localization');

    sails.models.localization.find().exec(function(err, items) {
      if (!err) {
        res.json(items)
      } else {
        res.json({status: 'error', error: err})
      }
    })

  },
  'get /post/*': {
    view: 'homepage'
  },
  'get /user/*': {
    view: 'homepage'
  },
  'get /modest_caric_spa': {
    view: 'admin/admin'
  },

  /**
   * @class
   * @param
   * @returns
   */
  'post /api/user/login': 'UsersController.login',

  /**
   * @class
   * @param
   * @returns
   */
  'post /api/user/register': 'UsersController.register',

  /**
   * @class
   * @param
   * @returns
   */
  'post /api/user/forgot_password': 'UsersController.forgotPassword',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/user/change_language': 'UsersController.changeLanguage',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/user/save_settings': 'UsersController.saveSettings',
////////
  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/params_settings/get': 'Params_settingsController.get',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/params_settings/get_localization': 'Params_settingsController.get_localization',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/params_settings/set_localization': 'Params_settingsController.set_localization',

  /**
   * @class
   * @param {string}
   * @returns
   */

/////////
  'post /api/post/create':'AdvertsController.create',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/post/update': 'AdvertsController.update',

  /**
   * получить список всех объявлений
   * @class
   * @param {string} type - (не обязательный) один из трех типов объявления
   * @param {string} filters - (не обязательный) фильтр определяет какие свойства вернуть
   * @param {string} preview - (не обязательный) если указан как true, то будет добавлена превью для каждого элемента
   * @param {string} limit - (не обязательный) количество записей, которое нужно вернуть
   * @param {string} sort - (не обязательный) (DESC or ASC) параметр сортировки
   * @param {string} skip - (не обязательный) количество записей которое нужно пропустить
   * @returns
   */
  'post /api/post/get': 'AdvertsController.get',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/post/get_one': 'AdvertsController.get_one',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/post/update_photo': 'AdvertsController.update_photo',

  /**
   * @class
   * @param {string}
   * @returns
   */
  'post /api/post/leave': 'AdvertsController.leave',

  /**
   * @class
   * @param {string}
   * @returns
   */
/////////
  'post /api/admin/dump/set': 'Params_settingsController.save_dump_in_file',

  /**
   * восстановить данные из файла (дампа) в базу данных
   * @class
   * @param {string}
   * @returns
   */
  'post /api/admin/dump/get': 'Params_settingsController.restore_dump_from_file',




  'post /api/parser/createadv': 'AdvertsController.parserCreateAdv',
  'post /api/parser/checkurl': 'AdvertsController.checkUrl',

  /**
   * получить изображение по составному урлу image_{advert_id}_{image_position}_{width}x{height}.jpg
   * @class
   * @returns image jpg
   */
  'get /image_*': 'AdvertsController.get_image'
};
