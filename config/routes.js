
module.exports.routes = {

  '/': {
    view: 'homepage'
  },
  'get /list/*': {
    view: 'homepage'
  },
  'get /modest_caric_spa': {
    view: 'admin/admin'
  }

  // '/user/*': {
  //   view: 'user'
  // },
  // 'get /list/wheels': 'IndexController.test',
  //

};
