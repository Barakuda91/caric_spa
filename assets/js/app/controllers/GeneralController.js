(function(){
  "use strict";
  var controllerName = 'GeneralController';

  angular.module("General").controller("GeneralController", GeneralController);

  GeneralController.$inject = [
    '$scope',
    '$rootScope',
    'Service',
    '$timeout',
    'md5',
    'localStorageService',
    '$log',
    'Upload',
    '$location'
  ];
  function GeneralController ($scope,$rootScope,Service,$timeout,md5,localStorageService,$log,Upload,$location) {
    $log.debug('GET '+controllerName);

    /*------------------------------------------------- установки ------------------------------------------------*/
    // дефаултный ключ пункта "выберете"
    $rootScope.defaultParameterKeyName = 'def_select';

    // устанавливает объект переводов
    var _ = $rootScope._ = $rootScope._    || Service.getLocalizator($rootScope);

    // объект настроек по умолчанию для модального окна авторизации
    $rootScope.reg_auth = {
      open: false,
      login: {
        open: true
      },
      register: {
        open: false
      },
      forgot: {
        open: false
      },
      success: {
        open: false
      }
    };

    // массив настроек полей при подаче объявления_____________________________________________________
    var advertAddSettingParams = {
      errorClass: {},
      general: {
        advertType: {},
        currency: {required: true},
        priceFor: {required: true},
        quantity: {},
        price: {required: true},
        advertPhoneNumber: {required: true},
        advertDescription: {},
        deliveryMethod: {},
        regions: {required: true},
        city : {required: true}
      },
      wheels: {
        centerHole: {},
        offset: {},
        wheelMaker: {},
        wheelModel: {},
        wheelType:  {required: true},
        wheelWidth: {required: true},
        pcd: {required: true},
        diameter: {required: true},
      },
      tyres: {
        tyreType: {required: true},
        tyreSpeedIndex: {},
        diameter: {required: true},
        tyreLoadIndex: {},
        tyreWidth: {required: true},
        productionYear: {},
        tyreHeight: {required: true},
        treadRest_1: {},
        treadRest_2: {},
        tyreMaker: {},
        tyreModel: {}
      },
      spaces: {
        spacesType: {},
        material: {},
        centerHole: {},
        fastenersType: {},
        spacesWidth: {required: true},
        pcdSpacesFrom: {required: true},
        pcdSpacesTo: {}
      }
    };


    // создаём объект для работы с параметрами
    $rootScope.setting = {
      // вытягиваем список параметров из локалдьной базы
      params: localStorageService.get('settingParameters') || {},
      // устанавливаем массив обязательных полей
      advertAddSettingParams: advertAddSettingParams,
      values: {},
      // кастомные списки выпадающие.
      customSelect: {
        wheelModel: {
          disabled: true,
          placeholder: 'SELECT_MAKER'
        },
        tyreModel: {
          disabled: true,
          placeholder: 'SELECT_MAKER'
        }
      }
    };

    // установка значений параметров для фильтров, подачи объявлений и т.д__________________________________________
    // TODO перенести эту хуйню в сервисы ДОЛОЙ ЛОГИКУ ИЗ КОНТРОЛЛЕРОВ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // если в локальной базе нет параметров - загружаем их
    //if(!$rootScope.setting.params) {
    if (true) {
      // получить список всей макеров
      io.socket.post('/api/params_settings/get', {type: 'MAKERS_ALL'}, function (resData) {
        var params = {
          tyreMaker: [],
          wheelMaker: [],
        };
        resData.data.forEach(function(el) {
          params[el.type+'Maker'].push({
            key: el.key,
            title: el.title,
            models: el.models
          })
        });
        $rootScope.setting.params = Object.assign({},$rootScope.setting.params,
          {
            tyreMaker: Service.getSettingParameter(params.tyreMaker),
            wheelMaker: Service.getSettingParameter(params.wheelMaker),
            tyreModel: [],
            wheelModel: []
          });
      });
      io.socket.post('/api/params_settings/get', {}, function (resData) {
        if (resData.status) {
          $rootScope.setting.params = Object.assign({},$rootScope.setting.params,{
            advertType: Service.getSettingParameter(resData.data.advertType, false),
            currency: Service.getSettingParameter(resData.data.currency, false),
            priceFor: Service.getSettingParameter(resData.data.priceFor, false),
            productionYear: Service.getSettingParameter(resData.data.productionYear),
            pcd: Service.getSettingParameter(resData.data.pcd),
            pcdSpacesFrom: Service.getSettingParameter(resData.data.pcd),
            pcdSpacesTo: Service.getSettingParameter(resData.data.pcd),
            diameter: Service.getSettingParameter(resData.data.diameter),
            material: Service.getSettingParameter(resData.data.material),
            tyreType: Service.getSettingParameter(resData.data.tyreType),
            tyreHeight: Service.getSettingParameter(resData.data.tyreHeight),
            tyreWidth: Service.getSettingParameter(resData.data.tyreWidth),
            tyreSpeedIndex: Service.getSettingParameter(resData.data.tyreSpeedIndex),
            tyreLoadIndex: Service.getSettingParameter(resData.data.tyreLoadIndex),
            wheelType: Service.getSettingParameter(resData.data.wheelType),
            wheelWidth: Service.getSettingParameter(resData.data.wheelWidth),
            wheelEt: Service.getSettingParameter(resData.data.wheelEt),
            spacesType: Service.getSettingParameter(resData.data.spacesType),
            fastenersType: Service.getSettingParameter(resData.data.fastenersType),
            regions: Service.getSettingParameter(resData.data.regions),
            deliveryMethod: Service.getSettingParameter(resData.data.deliveryMethod),
            quantity: Service.getSettingParameter(resData.data.quantity, false),
            spacesWidth: '',
            price: '',
            centerHole: '',
            offset: '',
            treadRest_1: '',
            treadRest_2: '',
            spacesCenterHole: '',
            advertPhoneNumber: '',
            advertDescription: ''
          });
          $rootScope.setting.values = Service.getDefaultSettingParamsValues(
            $rootScope.setting.params,
            {
              currency: 'USD',
              advertType: 'wheels',
              regions: '0',
              wheelMaker: '0',
              tyresMaker: '0',
              priceFor: 'FOR_THE_WHOLE_LOT',
              quantity: '4'
            },
            false);
          console.log($rootScope.setting.values, $rootScope.setting.params)
          localStorageService.set('parameters', $rootScope.setting.params)
        } else {
          $log.error(resData.data)
        }
// <<<<<<< HEAD
      });
    } else {
      $rootScope.setting.values = Service.getDefaultSettingParamsValues(
        $rootScope.setting.params,
        {
          currency: 'USD',
          advertType: 'wheels',
          regions: '0',
          wheelMaker: '0',
          tyresMaker: '0',
          priceFor: 'FOR_THE_WHOLE_LOT',
          quantity: '4'
        },
        false);
    }
    /*-------------------------------------------------- установки [END] -----------------------------------------*/
    /*-------------------------------------------------- функции -------------------------------------------------*/

    // TODO сделать универсальные функции работы с полями выбора
    /* вызывается когда изменилось значение выпадающего списка параметра
     * нужно взять подсписок у текущего элемента,
     * и добавть этот подсписок в новый элемент
     * */
    $rootScope.customSelectInputChange = function (type, target) {
      $rootScope.setting.customSelect[type].disabled = false;
      $rootScope.setting.customSelect[type].placeholder = '';
      if(
        $rootScope.setting.params[target][$rootScope.setting.values[target]].models &&
        $rootScope.setting.params[target][$rootScope.setting.values[target]].models.length > 0)
      {
        $rootScope.setting.customSelect[type].mainDivClass = 'select-list';
      } else {
        $rootScope.setting.customSelect[type].mainDivClass = '';
      }
      $rootScope.setting.customSelect[type].value = '';
    };
    // фокус на блоке выбора модели
    //$rootScope.searchBlockFocus = function(){
    $rootScope.customSelectFocus = function(type){
      console.log('focus');

      $rootScope.setting.customSelect[type].itemListClass = 'show'
    };

    /*
     * при потери фокуса следует закрыть выпадающий список
     * */
    $rootScope.customSelectBlur = function(type){
      console.log('blur');

      $timeout(function(){
        $rootScope.setting.customSelect[type].itemListClass = '';
        var title = $rootScope.setting.customSelect[type].value;
        if(
          !$rootScope.setting.values[type] ||
          (
// =======
//         /*-------------------------------------------------- установки [END] -----------------------------------------*/
//         /*-------------------------------------------------- функции -------------------------------------------------*/
//
//         // TODO сделать универсальные функции работы с полями выбора
//         /* вызывается когда изменилось значение выпадающего списка параметра
//          * нужно взять подсписок у текущего элемента,
//          * и добавть этот подсписок в новый элемент
//          * */
//         $rootScope.customSelectInputChange = function (type, target) {
//             $rootScope.setting.customSelect[type].disabled = false;
//             $rootScope.setting.customSelect[type].placeholder = '';
//             if(
//                 $rootScope.setting.params[target][$rootScope.setting.values[target]].models &&
//                 $rootScope.setting.params[target][$rootScope.setting.values[target]].models.length > 0)
//             {
//                 $rootScope.setting.customSelect[type].mainDivClass = 'select-list';
//             } else {
//                 $rootScope.setting.customSelect[type].mainDivClass = '';
//             }
//             $rootScope.setting.customSelect[type].value = '';
//         };
//         // фокус на блоке выбора модели
//         //$rootScope.searchBlockFocus = function(){
//         $rootScope.customSelectFocus = function(type){
//             console.log('focus');
//
//             $rootScope.setting.customSelect[type].itemListClass = 'show'
//         };
//
//         /*
//          * при потери фокуса следует закрыть выпадающий список
//          * */
//         $rootScope.customSelectBlur = function(type){
//             console.log('blur');
//
//             $timeout(function(){
//                 $rootScope.setting.customSelect[type].itemListClass = '';
//                 var title = $rootScope.setting.customSelect[type].value;
//                 if(
//                     !$rootScope.setting.values[type] ||
//                     (
//                         true
//                     )) {
//                         var item = {
//                             new_key: true,
//                             title: title.toUpperCase(),
//                             key: title.toLowerCase().replace(/\s/g, '_'),
//                         };
//                         $rootScope.setting.values[type] = item;
//                         console.log(item)
//                     }
//             }, 50);
//         };
//
//         // ивент выбора элемента из выпадающего кастомного списка
//         $rootScope.customSelectChooseItem = function( item, type ){
//             $rootScope.setting.values[type] = {key: item.key, title: item.title};
//             $rootScope.setting.customSelect[type].value = item.title;
//             $rootScope.setting.customSelect[type].itemListClass = '';
//         };
//
//         // вызывает модальное окно при клике на название параметра в фильтре
//         $rootScope.modal = {};
//         $rootScope.getModalWithDescription = function(type) {
//             $rootScope.modal.blockTextName = type+'_TEXT';
//             Service.modal($rootScope, {
//                 size: 'sm',
//                 okButton: true,
//                 header: type,
//                 template: 'parameter_description'
//             })
//         };
//
//         // сработает при получении или потере фокуса полем ввода поискового запроса_____________________________________
//         $rootScope.searchInputFocus = function(type) {
//             if(type) {
//                 $rootScope.searchInputBlock = 'active';
//             } else {
//                 $rootScope.searchInputBlock = '';
//             }
//
//         };
//
//         // обработчик нажатия на кнопку смены языка_____________________________________________________________________
//         $rootScope.changelang = function(language) {
//             $rootScope.userData.language = language;
//             localStorageService.set('user_data', $rootScope.userData);
//
//             if ($rootScope.userData.auth) {
//                 io.socket.post('/api/user/change_language', {language: language}, function (resData) {
//                     if(resData) {
//
//                         localStorageService.set('user_data', $rootScope.userData);
//                     } else {
//                         $log.error(resData)
//                     }
//                 })
//             }
//         };
//
//         // открытие закрытие модального окна логина, регистрации
//         $rootScope.modalLoginOpenSwitcher = function (type) {
//             $log.debug(controllerName+'.modalLoginOpenSwitcher');
//
//             if(type == 'open' ) {
//                 Service.modal($rootScope,{
//                     template: 'reg_auth',
//                     crossButton: true
//                 });
//                 // возврашаем дефолтное сосотояние модального окна
//                 $rootScope.reg_auth.login.open = true;
//                 $rootScope.reg_auth.register.open = false;
//                 $rootScope.registerActiveClass = 'notActiveBlock';
//                 $rootScope.loginActiveClass = '';
//                 // чистим введеные ранее данные
//                 if ($rootScope.reg_auth.form && $rootScope.reg_auth.form.login) {
//                     $rootScope.reg_auth.form.login.email = '';
//                     $rootScope.reg_auth.form.login.password = '';
//                 }
//                 if ($rootScope.reg_auth.form && $rootScope.reg_auth.form.register) {
//                     $rootScope.reg_auth.form.register.username = '';
//                     $rootScope.reg_auth.form.register.email = '';
//                     $rootScope.reg_auth.form.register.password = '';
//                     $rootScope.reg_auth.form.register.confirmPassword = '';
//                 }
//             } else {
//                 Service.modal($rootScope);
//             }
//         };
//
//         // переключение в модальном окне (вход - регистрация)___________________________________________________________
//         $rootScope.modelLoginSwitch = function (type) {
//             $log.debug(controllerName+'.modelLoginSwitch+');
//
//             $rootScope.reg_auth.login.open = false;
//             $rootScope.reg_auth.register.open = false;
//             $rootScope.reg_auth[type].open = true;
//             if ($rootScope.reg_auth.login.open) {
//                 $rootScope.registerActiveClass = 'notActiveBlock';
//                 $rootScope.loginActiveClass = '';
//             } else {
//                 $rootScope.loginActiveClass = 'notActiveBlock';
//                 $rootScope.registerActiveClass = '';
//             }
//         };
//
//         // включение отключение блока "забыл пароль"____________________________________________________________________
//         $rootScope.modelLoginForgot = function () {
//             $log.debug(controllerName+'.modelLoginForgot');
//
//             $rootScope.reg_auth.forgot.open = !$rootScope.reg_auth.forgot.open;
//         };
//
//         // функция авторизации, регистрации, восстановления пароля______________________________________________________
//         $rootScope.loginFormFunction = function(type) {
//             if ($rootScope.reg_auth.form) {
//                 var data = {};
//                 switch (type) {
//                     case "login":
//                         data = {
//                             email: $rootScope.reg_auth.form[type].email,
//                             password: md5.createHash($rootScope.reg_auth.form[type].password || '')
//                         };
//                         break;
//                     case "register":
//                         data = {
//                             username: $rootScope.reg_auth.form[type].username,
//                             email: $rootScope.reg_auth.form[type].email,
//                             password: md5.createHash($rootScope.reg_auth.form[type].password || ''),
//                             confirmPassword: md5.createHash($rootScope.reg_auth.form[type].confirmPassword || '')
//                         };
//                         break;
//                     default:
//                         break;
//                 }
//
//                 if ($rootScope.reg_auth.form[type].email) {
//                     io.socket.post('/api/user/' + type, data, function (resData) {
//                         if (resData.status) {
//                             $rootScope.userData = angular.extend($rootScope.userData, resData.data);
//                             $rootScope.userData.auth = true;
//                             localStorageService.set('user_data', $rootScope.userData);
//                             Service.modal($rootScope);
//                             $rootScope.$digest();
//                         } else {
//                             $log.error(resData.data)
//                         }
//                     })
//                 } else {
//                     $log.error('NO EMAIL IN FORM');
//                 }
//             }
//         };
//
//         // функция выхода_______________________________________________________________________________________________
//         $rootScope.userLogout = function() {
//             defaultUserData();
//             $location.path('/');
//         };
//
//         $rootScope.$watch( // TODO исправить
//             function () {
//                 return window.innerWidth;
//             },
//             function (value) {
//                 $rootScope.windowWidth = value;
//             },
// >>>>>>> ba6cf7dac816538742eabcae4dd6d012d69f8f2c
            true
          )) {
          var item = {
            new_key: true,
            title: title.toUpperCase(),
            key: title.toLowerCase().replace(/\s/g, '_'),
          };
          $rootScope.setting.values[type] = item;
        }
      }, 50);
    };

    // ивент выбора элемента из выпадающего кастомного списка
    $rootScope.customSelectChooseItem = function( item, type ){
      $rootScope.setting.values[type] = {key: item.key, title: item.title};
      $rootScope.setting.customSelect[type].value = item.title;
      $rootScope.setting.customSelect[type].itemListClass = '';
    };

    // вызывает модальное окно при клике на название параметра в фильтре
    $rootScope.modal = {};
    $rootScope.getModalWithDescription = function(type) {
      $rootScope.modal.blockTextName = type+'_TEXT';
      Service.modal($rootScope, {
        size: 'sm',
        okButton: true,
        header: type,
        template: 'parameter_description'
      })
    };

    // сработает при получении или потере фокуса полем ввода поискового запроса_____________________________________
    $rootScope.searchInputFocus = function(type) {
      if(type) {
        $rootScope.searchInputBlock = 'active';
      } else {
        $rootScope.searchInputBlock = '';
      }

    };

    // обработчик нажатия на кнопку смены языка_____________________________________________________________________
    $rootScope.changelang = function(language) {
      $rootScope.userData.language = language;
      localStorageService.set('user_data', $rootScope.userData);

      if ($rootScope.userData.auth) {
        io.socket.post('/api/user/change_language', {language: language}, function (resData) {
          if(resData) {

            localStorageService.set('user_data', $rootScope.userData);
          } else {
            $log.error(resData)
          }
        })
      }
    };

    // открытие закрытие модального окна логина, регистрации
    $rootScope.modalLoginOpenSwitcher = function (type) {
      $log.debug(controllerName+'.modalLoginOpenSwitcher');

      if(type == 'open' ) {
        Service.modal($rootScope,{
          template: 'reg_auth',
          crossButton: true
        });
        $rootScope.registerActiveClass = 'notActiveBlock';
        $rootScope.loginActiveClass = '';
      } else {
        Service.modal($rootScope);
      }
    };

    // переключение в модальном окне (вход - регистрация)___________________________________________________________
    $rootScope.modelLoginSwitch = function (type) {
      $log.debug(controllerName+'.modelLoginSwitch+');

      $rootScope.reg_auth.login.open = false;
      $rootScope.reg_auth.register.open = false;
      $rootScope.reg_auth[type].open = true;
      if ($rootScope.reg_auth.login.open) {
        $rootScope.registerActiveClass = 'notActiveBlock';
        $rootScope.loginActiveClass = '';
      } else {
        $rootScope.loginActiveClass = 'notActiveBlock';
        $rootScope.registerActiveClass = '';
      }
    };

    // включение отключение блока "забыл пароль"____________________________________________________________________
    $rootScope.modelLoginForgot = function () {
      $log.debug(controllerName+'.modelLoginForgot');

      $rootScope.reg_auth.forgot.open = !$rootScope.reg_auth.forgot.open;
    };

    // функция авторизации, регистрации, восстановления пароля______________________________________________________
    $rootScope.loginFormFunction = function(type) {
      var data = {};
      switch (type) {
        case "login":
          data = {
            email: $rootScope.reg_auth.form[type].email,
            password: md5.createHash($rootScope.reg_auth.form[type].password || '')
          };
          break;
        case "register":
          data = {
            username: $rootScope.reg_auth.form[type].username,
            email: $rootScope.reg_auth.form[type].email,
            password: md5.createHash($rootScope.reg_auth.form[type].password || ''),
            confirmPassword: md5.createHash($rootScope.reg_auth.form[type].confirmPassword || '')
          };
          break;
        default:
          break;
      }

      io.socket.post('/api/user/'+type, data, function (resData) {
        if (resData.status) {
          $rootScope.userData = resData.data;
          $rootScope.userData.auth = true;
          localStorageService.set('user_data', $rootScope.userData);
          Service.modal($rootScope);
          $rootScope.$digest();
        } else {
          $log.error(resData.data)
        }
      })
    };

    // функция выхода_______________________________________________________________________________________________
    $rootScope.userLogout = function() {
      defaultUserData();
      $location.path('/');
    };

    $rootScope.$watch( // TODO исправить
      function () {
        return window.innerWidth;
      },
      function (value) {
        $rootScope.windowWidth = value;
      },
      true
    );

    angular.element(window).bind('resize', function(){
      Service.allignImageInBlock($rootScope.windowWidth);
      $rootScope.$apply();
    });

    /* массив размеров для бутсрап классов для главной страницы галереи */
    $rootScope.screenWidthData = {
      0: '1',
      1: '430',
      2: '768',
      3: '992',
      4: '1200',
      5: '1200'
    };

    // устанавливает параметры по умолчанию для пользовательского объекта___________________________________________
    function defaultUserData() {
      $rootScope.userData = {
        auth: false,
        language: 'ru',
        settings: {/* Default user settings all enabled */
          show_disks: true,
          show_tires: true,
          show_spacers: true,
          show_posts: true,
          show_currency: 'usd',
          firstname: '',
          lastname: '',
          telephone: '',
          password: '',
          confirm_password: ''
        }
      };
      localStorageService.set('user_data', $rootScope.userData)
    }
    /*-------------------------------------------------- функции [END] -------------------------------------------*/
    /*-------------------------------------------------- код, который отрабатывает при загрузке контроллера ------*/
    // загрузка контроллера после обновления страницы_______________________________________________________________
    if(!$rootScope.userData) {
      // если пользователь уже заходил на сайт, и у него есть user_data
      if (localStorageService.get('user_data')) {
        // считываем user_data в рабочую переменную
        $rootScope.userData = localStorageService.get('user_data');
        if (!$rootScope.userData.settings) {
          /* Default user settings all enabled */
          $rootScope.userData.settings = {
            show_disks: true,
            show_tires: true,
            show_spacers: true,
            show_posts: true,
            show_currency: 'usd',
            firstname: '',
            lastname: '',
            telephone: '',
            password: '',
            confirm_password: ''
          }
        }
      } else {
        // если пользователь зашел впервые - устанавливаем ему user_data, сохраняя её в память
        defaultUserData();
      }
    }

    // устанавливает цвет кнопки текущего языка при загрузке
    $rootScope.localizationButton = Service.getLocalizationButton($rootScope.userData.language);

    // отключение спинера загрузки страницы TODO сделать выключение спинера по загрузке всех данных_________________
    $timeout(function() {
      return document.getElementById('spinner').className = "spinnerFullBlock spinnerOff";
    },1000);

    /*-------------------------------------------------- [END] ---------------------------------------------------*/
    /*-------------------------------------------------- перехватчики --------------------------------------------*/
    // перехватываем пост для того, чтобы добавить токен в каждый запрос____________________________________________
    io.socket.post = new Proxy(io.socket.post, {
      apply: function (target, thisArgument, argumentsList) {
        var token = $rootScope.userData.token || null;
        if(typeof argumentsList[1] == 'object') {
          argumentsList[1].token = token;
        } else if(typeof argumentsList[1] == 'function') {
          argumentsList = [argumentsList[0],{token:token},argumentsList[1]];
        }
        var f = argumentsList[2];
        argumentsList[2] = function(r){
          $log.log({path: argumentsList[0], status: r.status, requestData: argumentsList[1], responseData: r.data});f(r)}
        return target.apply(thisArgument, argumentsList);
      }
    });

    // меняет цвет кнопки текущего языка
    $scope.$watch('userData.language',function(newVal, oldVal){
      if (newVal === oldVal) {
        return;
      }
      $rootScope.localizationButton = Service.getLocalizationButton($rootScope.userData.language)
    });
    /*-------------------------------------------------- перехватчики [END] --------------------------------------*/
  }
})();
