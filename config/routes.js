
module.exports.routes = {

  '/': {
    view: 'homepage'
  },
  'get /list/*': {
    view: 'homepage'
  },
  '/api/localization': function (req, res) {
    sails.log(req.method,' /api/localization');

    sails.models.localization.find().exec(function(err, items) {
        if (!err) {
          res.json(items)
        } else {
          res.json({status: 'error', error: err})
        }
    })

  },
  'get /advert/*': {
    view: 'homepage'
  },
  'get /modest_caric_spa': {
    view: 'admin/admin'
  },
  'get /api/user/auth': 'UsersController.auth',
  'get /api/admin/create_db': 'Params_settingsController.create_db' // TODO закрыть доступ к этому методу или удалить его к херушкам
  // '/user/*': {
  //   view: 'user'
  // },
  // 'get /list/wheels': 'IndexController.test',
  //

};
