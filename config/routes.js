
module.exports.routes = {

  '/': {
    view: 'homepage'
  },
  'get /list/*': {
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

  'post /api/user/login': 'UsersController.login',
  'post /api/user/register': 'UsersController.register',
  'post /api/user/forgot_password': 'UsersController.forgotPassword',
  'post /api/user/change_language': 'UsersController.changeLanguage',

  'post /api/params_settings/get': 'Params_settingsController.get',
  'post /api/params_settings/get_localization': 'Params_settingsController.get_localization',
  'post /api/params_settings/set_localization': 'Params_settingsController.set_localization',


  'post /api/post/create':'AdvertsController.create',
  'post /api/post/update': 'AdvertsController.update',
  'post /api/post/get': 'AdvertsController.get',
  'post /api/post/get_one': 'AdvertsController.get_one',
  'post /api/post/update_photo': 'AdvertsController.update_photo',

  'post /api/admin/dump/set': 'Params_settingsController.save_dump_in_file',
  'post /api/admin/dump/get': 'Params_settingsController.restore_dump_from_file',
  'get /test': 'Params_settingsController.add_localization_cities'


};
