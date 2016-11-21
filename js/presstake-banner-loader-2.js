// Главный объект функционала баннера
var PRESSTAKE_BANNER_CORE = {
  // Функция инициализации баннера
  // Функция принимает конфигурации
  init : function(config){
    // Если нет конфигураций то
    if (!config) {
      // Вызываеся функция инициализации конфигураций без параметров
      PRESSTAKE_BANNER_CORE.CONTROLLERS.INIT_CONTROLLER.init_config();
    } else {
      // Вызывается функция инициализации конфигураций с конфигурациями
      PRESSTAKE_BANNER_CORE.CONTROLLERS.INIT_CONTROLLER.init_config(config);
    }
    // вызывается функция инициализации баннера
    PRESSTAKE_BANNER_CORE.CONTROLLERS.INIT_CONTROLLER.init_banner();
  },
  // конфигурации (пути, данные клиента)
  CONFIG : {
    // Классы для баннера порядковый номер равен порядковому номеру ответа сервера
    bannerClasses : [
      // Класс по умолчанию
      "pt-banner-gadgets",
      // Класс для книг
      "pt-banner-books",
      // Класс для одежды
      "pt-banner-clothes_shop",
      // Класс для фильмов
      "pt-banner-films",
      // Класс для игр
      "pt-banner-games",
      // Класс для гаджетов
      "pt-banner-gadgets"
    ],
    // Статусы от сервера
    status : {
      // статус "есть данные, загружаем баннер"
      STATUS_OK : 1,
      // статус "страница обрабатывается"
      STATUS_DATA_LOADING : 2,
      // статус "Нет данных"
      STATUS_NO_DATA : 3
    },
    // адреса для связи с сервером по умолчанию
    URL : {
      // днс адресс сервера
      TARGET_URL : "presstake.com/",
      // адрес к файлу обработки страницы
      PASRSE_URL : "bpage/banner.php",
      // адрес к файлу загрузки листинга офферов
      APPS_URL : "banner/index.php",
      // адрес к файлу обработки статистики
      STAT_URL : "stat/index.php",
      // адрес к файлу обработки присоединения пользователя к системе
      SUBSCRIBE_URL : "subscribe/index.php",
      // адресс к файлу обработки отсоединения пользователя от системы
      UNSUBSCRIBE_URL : "subscribe/index.php",
      // адрес к файлу для редиректа на маркет
      TRACKING_URL : "tracking/index.php",
      // адресс к файлу стилей
      CSS_URL : "banner-client/css/presstake-banner.css",
      // адресс к файлу скрипта
      JS_URL : "banner-client/js/presstake-banner.js"
    },
    // идентификатор HTML узла загрузчика данного скрипта
    loaderID : "presstake-banner-loader",
    // Статус загрузки листинга офферов
    bannerSpaceID : "prestake-banner",
    appListStatus : 0,
    // Статус обработки страницы сервером
    pageStatus : 0,
    // Время повторений репитеров
    repeatTimeout : 30000,
    // Количество повторений репитеров
    repeatCounter : 3,
    // включение, отключение записи ошибок
    debag : true,
    // листинг ошибок
    debagList : []
  },
  // Хранение сгруппированных задач
  CONTROLLERS : {
    // Контроллер содержащий функции для инициализации функционала банера
    INIT_CONTROLLER : {
      // функция для формирования HTML узлов и событий
      init_content : function () {
        // объявление контроллера отрисовки и модели отрисовки
        var view_controller = PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER,
            view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // подключение стилей
        view_controller.createCss();
        // формирование html узлов банера
        view_controller.create_banner();
        // определение пропорций банера по ширине экрана
        view_model.zoomEvent();
        // определение отступа баннера от левого края
        view_model.scrollEvent();
        // Добовление событий на скролл
        view_controller.addWindowScrollEvent();
        // Добавление событий на изменение зума
        view_controller.addWindowZoomEvent();
        // Добавление события на открытие списка офферов при клике
        view_controller.addBannerMainFirstEvent();
        // Добавление события на закрытие всего баннера при клике на крестик
        view_controller.addBannerMainCloseButtonEvent();
        // Добавление события на закрытие списка офферов при клике на крестик
        view_controller.addBannerListCloseButtonEvent();
      },
      // Функция для получения всех данных для отображения и серверной обработки страницы клиента
      init_banner : function () {
        // Объявление контроллера загрузок и конфигурации
        var load_controller = PRESSTAKE_BANNER_CORE.CONTROLLERS.LOAD_CONTROLLER,
            config = PRESSTAKE_BANNER_CORE.CONFIG;
        // Запускаем запрос на обработку страницы сервером
        load_controller.loadPage();
      },
      // Функция инициализации первичных настроек банера
      // Функция принимает конфигурации для инициализации
      init_config : function (config) {
        // Объявление дискриптора модели конфигурации
        var config_model = PRESSTAKE_BANNER_CORE.MODELS.CONFIG_MODEL;
        // Если нет конфигураций то
        if (!config) {
          // Конфигурации берутся из описаных по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
          // Если есть то
        } else {
          // Конфигурации приравнимаются к полученным c однократным угрублением
          for (var key in config) {
            if (typeof(config[key]) == "object") {
              for (var itemKey in config[key]) {
                PRESSTAKE_BANNER_CORE.CONFIG[key][itemKey] = config[key][itemKey];
              }
            } else {
              PRESSTAKE_BANNER_CORE.CONFIG[key] = config[key];
            }
          }
          // Переменая становится дискриптором конфигураций
          config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        // Записываем адресс клиента
        config.location = window.location.href;
        // Записываем протокол клиента
        config.URL.PROTOCOL = config_model.getProtocol();
        // Записываем операционную систему клиента в конфигурации
        config.clientOS = config_model.getClientOS();
        // Записываем скролл клиента в конфигурации
        config_model.getScroll(config);
        // Записываем зум для баннера в конфигурации
        config_model.getZoom(config);
        // Записываем отступ от левого края в процентном соотношении в конфигурации
        config_model.getBannerLeft();
        // Записываем отступ от нижнего края псевдо видимой области экрана в конфигурации
        config_model.getBannerBottom();
        // Если удалось записать конфигурации с HTML узлов то
        if (config_model.getDOMConfig(config)){
          // Возращаем положительный результат
          return true;
          // Если нет то
        } else {
          // Возвращаем отрицательный результат
          return false;
        }
      }
    },
    // Контроллер загрузок отвечает за все загрузки с сервера
    LOAD_CONTROLLER : {
      // функция запроса на обработку страницы
      // функция принимает конфигурации
      loadPage : function (config) {
        // объявление модели ассихронной связи, модели запросов и модели формирования путей
        var ajax_model = PRESSTAKE_BANNER_CORE.MODELS.AJAX_MODEL,
            request_model = PRESSTAKE_BANNER_CORE.MODELS.REQUEST_MODEL,
            url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL;
        // Если не были переданы конфигурации то
        if (!config) {
          // Объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        // Объявляем функцию которая выполниться если нужно повторять запрос
        var error = function () {
          ajax_model.repeater(config, ajax_model.request, url_builder_model.getCheckLoadingUrl(config), request_model.loadingPageSuccess);
        };
        // Делаем запрос на сервер для сканирования страницы и добавляем репитер в случае не удачи
        ajax_model.request(url_builder_model.getCheckLoadingUrl(config), request_model.loadingPageSuccess, error);
      },
      // функция загрузки листинга офферов
      // функция принимает конфигурации
      loadAppList : function (config) {
        // объявляем модель ассихронной связи, модель запросов к серверу, модель формирования путей
        var ajax_model = PRESSTAKE_BANNER_CORE.MODELS.AJAX_MODEL,
            request_model = PRESSTAKE_BANNER_CORE.MODELS.REQUEST_MODEL,
            url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL;
        // Если конфигурации не были переданы то
        if (!config) {
          // Объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        // Объявляем функцию которая выполниться если нужно повторять запрос
        var error = function(){
          ajax_model.repeater(config, ajax_model.request, url_builder_model.getLoadListUrl(config), request_model.loadAppListSuccess);
        };
        // Делаем запрос на сервер для получения списка офферов и добавляем репитер в случае не удачи
        ajax_model.request(url_builder_model.getLoadListUrl(config), request_model.loadAppListSuccess, error);
      }
    },
    // Контроллер отрисовки и назначения событий
    VIEW_CONTROLLER : {
      // функция создания html узлов баннера
      create_banner : function (config) {
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // создаются html узлы баннера
        view_model.create_banner();
      },
      // функция для подключения стилей
      createCss : function (){
        // Объявляется модель путей, отрисоки, конфигурации, и записываем путь до стилей
        var url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL,
            view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config = PRESSTAKE_BANNER_CORE.CONFIG,
            url = url_builder_model.getCSSUrl(config);
        // Формируем прилинковку в html структуру документа
        view_model.createCss(url);
      },
      // функция показа банера
      showBanner : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // высывается функция показа баннера
        view_model.showBanner();
      },
      // функция сокрытия баннера
      hideBanner : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // функция скривает баннер
        view_model.hideBanner();
      },
      // функция открытие листинга офферов
      openList : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // функция открытия листинга ооферов
        view_model.openList();
      },
      // функция закрытия листинга офферов
      closeList : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // функция закрытия листинга офферов
        view_model.closeList();
      },
      // функция добавления события открытия листинга офферов в главную облать баннера при клике
      addBannerMainFirstEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция добаления события к главной области, в которую отдаём событие открытия листинга офферов
        view_model.addBannerMainClickEvent(view_model.bannerMainClickFirstEvent);
      },
      // функция удаления открытия листинга офферов с главной облати баннера при клике
      removeBannerMainFirstEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция удаления события с главной области при клике, в которую передаём событие открытия списка офферов
        view_model.removeBannerMainClickEvent(view_model.bannerMainClickFirstEvent);
      },
      // функция добавления события скрывания листинга офферов на главную область баннера
      addBannerMainSecondEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция добавления события при клике на главную область баннера, в которую передаётся событие скривания листинга офферов
        view_model.addBannerMainClickEvent(view_model.bannerMainClickSecondEvent);
      },
      // функция удаления события скривания листинга ооферов с главной области баннера
      removeBannerMainSecondEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция удаления события при клике на главную облать баннера, в которую передаётся события скривание листинга офферов
        view_model.removeBannerMainClickEvent(view_model.bannerMainClickSecondEvent);
      },
      // функция добвления события скрывания всего баннера на крестик главной области
      addBannerMainCloseButtonEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция добавления события на крестик главной области, в которую передаётся событие скрывания всего баннера
        view_model.addBannerMainCloseButtonEvent(view_model.bannerMainCloseButtonEvent);
      },
      // функция удаления события скривания всего баннера с крестика главнной области баннера
      removeBannerMainCloseButtonEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция удаления события с крестика главнной области баннера, в которую передаём события скрывания всего баннера
        view_model.removeBannerMainCloseButtonEvent(view_model.bannerMainCloseButtonEvent);
      },
      // функция добавления события скрывания листинга офферов на крестик в углу листинга офферов
      addBannerListCloseButtonEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция добавления события на крестик в углу листинга офферов, в которую передаём события скривания листинга
        view_model.addBannerListCloseButtonEvent(view_model.bannerListCloseButtonEvent);
      },
      // функция удаления события скрывания листинга офферов с крестика в углу листинга офферов
      removeBannerListCloseButtonEvent : function(){
        // объявляется модель отрисовки
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        // вызывается функция удаления события с крестика в углу листинга офферов, в которую передаётся событие сокрытия листинга офферов
        view_model.removeBannerListCloseButtonEvent(view_model.bannerListCloseButtonEvent);
      },
      // функция добавления события открытия баннера на скрол
      addWindowScrollEvent : function(){
        // бъявляется модель отрисовки и модель конфигураций
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config_model = PRESSTAKE_BANNER_CORE.MODELS.CONFIG_MODEL;
        // вызывается функция добавления события на скролл, в которую передаётся собырие записи в конфигурации скролла клиента
        view_model.addWindowScrollEvent(config_model.getScroll);
        // вызывается функция добавления события на скролл, в которую передаётся собырие показа баннера
        view_model.addWindowScrollEvent(view_model.scrollEvent);
      },
      // функция удаления события открытия баннера на скролл
      removeWindowScrollEvent : function(){
        // объявляется модель отрисовки и конфигурационная модель
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config_model = PRESSTAKE_BANNER_CORE.MODELS.CONFIG_MODEL;
        // вызывается функция удаления события на скролл, в которую передаётся событие открытия баннера
        view_model.removeWindowScrollEvent(view_model.scrollEvent);
        // вызывается функция удаления события на скролл, в которую передаётся событие получения скролла клиента
        view_model.removeWindowScrollEvent(config_model.getScroll);
      },
      // функция добавления событий подгонки баннера на зумирование экрана
      addWindowZoomEvent : function(){
        // объявляется модель отрисовки и конфигурационная модель
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config_model = PRESSTAKE_BANNER_CORE.MODELS.CONFIG_MODEL;
        // объявляется функция добавления событий на зумирование экрана, в которую передаётся событие записи зума клиента
        view_model.addWindowZoomEvent(config_model.getZoom);
        // объявляется функция добавления событий на зумирование экрана, в которую передаётся событие записи левого отступа для баннера
        view_model.addWindowZoomEvent(config_model.getBannerLeft);
        // объявляется функция добавления событий на зумирование экрана, в которую передаётся событие записи нижнего отступа для баннера
        view_model.addWindowZoomEvent(config_model.getBannerBottom);
        // объявляется функция добавления событий на зумирование экрана, в которую передаётся событие подговнки пропорций баннера
        view_model.addWindowZoomEvent(view_model.zoomEvent);
      },
      // функция удаления событий при зумировании баннера
      removeWindowZoomEvent : function(){
        // объявляется модель отрисовки и конфигурационная модель
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config_model = PRESSTAKE_BANNER_CORE.MODELS.CONFIG_MODEL;
        // вызывается функция удаления событий на зум окна, в которую передаётся событие получения зума для баннера
        view_model.removeWindowZoomEvent(config_model.getZoom);
        // вызывается функция удаления событий на зум окна, в которую передаётся событие записи нижнего отступа для баннера
        view_model.removeWindowZoomEvent(config_model.getBannerBottom);
        // вызывается функция удаления событий на зум окна, в которую передаётся событие записи левого отступа для баннера
        view_model.removeWindowZoomEvent(config_model.getBannerLeft);
        // вызывается функция удаления событий на зум окна, в которую передаётся событие подгона пропорций баннера
        view_model.removeWindowZoomEvent(view_model.zoomEvent);
      }
    },
    // контроллер событий
    EVENT_CONTROLLER : {
      // функция дополняет собой события на открытия баннера
      showBannerEvent : function(){
        // бъявляется контроллер отрисовки, модель связи с сервером, модель запросов, модель путей, конфигурации, запись пути для статистики, функция запускающая репитер
        var view_controller = PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER,
            ajax_model = PRESSTAKE_BANNER_CORE.MODELS.AJAX_MODEL,
            request_model = PRESSTAKE_BANNER_CORE.MODELS.REQUEST_MODEL,
            url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL,
            config = PRESSTAKE_BANNER_CORE.CONFIG,
            url = url_builder_model.getStatUrl_BannerVisible(config),
            error = function(){
              // вызов функции повтора повтарений, в которую передаётся конфигурации, функция связи, путь для статистики, функция удачной отправки данных
              ajax_model.repeater(config, ajax_model.request, url, request_model.statBannerSuccess);
            };
        // удаление событий со скролла
        view_controller.removeWindowScrollEvent();
        // запрос на отправку, в который передаётся путь для статистики, функция в случае удачи и не удачи
        ajax_model.request(url, request_model.statBannerSuccess, error);
      },
      // функция которая дополниет собой событие открытия листинга офферов при клике на главную облать
      bannerMainClickFirst : function(){
        // объявляем контроллер отрисовки
        var view_controller = PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER;
        // удаления события открытия листинга офферов с кнопки
        view_controller.removeBannerMainFirstEvent();
        // добавления события скрития листинга офферов на кнопку
        view_controller.addBannerMainSecondEvent();
      },
      // функция которая дополняет собой событие скрытия листинга офферов
      bannerMainClickSecond : function(){
        // бъявляется контроллер отрисовки
        var view_controller = PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER;
        // удаляется событие скрития листинга офферов
        view_controller.removeBannerMainSecondEvent();
        // добовления события открытия листинга офферов
        view_controller.addBannerMainFirstEvent();
      },
      // функция которая дополняет собой событие скрития баннера
      hideBannerEvent : function(){
        // объявляется модель связи, модель запросов, модель путей, онфигурации, путь до статистики и функция запускающая повтор запросов
        var ajax_model = PRESSTAKE_BANNER_CORE.MODELS.AJAX_MODEL,
            request_model = PRESSTAKE_BANNER_CORE.MODELS.REQUEST_MODEL,
            url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL,
            config = PRESSTAKE_BANNER_CORE.CONFIG,
            url = url_builder_model.getStatUrl_BannerUnvisible(config),
            error = function () {
              // функция повтора запросов, в которую передаются конфигурации, функция связи, путь до статистики, функция в случае успешного запроса
              ajax_model.repeater(config, ajax_model.request, url, request_model.statBannerSuccess);
            };
        // вызов вункции запроса, в которую передаётся путь до статистики, метод успешного запроса и не успешного
        ajax_model.request(url, request_model.statBannerSuccess, error);
      },
      // функция которая дополняет собой событие открытия баннера
      openBannerEvent : function(){
        // объявляется модель связи, модель путей, модель запросов, конфигурации, путь до статистики и функция в случае не удачного запроса
        var ajax_model = PRESSTAKE_BANNER_CORE.MODELS.AJAX_MODEL,
            url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL,
            request_model = PRESSTAKE_BANNER_CORE.MODELS.REQUEST_MODEL,
            config = PRESSTAKE_BANNER_CORE.CONFIG,
            url = url_builder_model.getStatUrl_BannerOpen(config),
            error = function(){
              // запуск повтора запросов, который получит конфигурации, функцию запроса, путь до статистики, функцию успешного выполнения запроса
              ajax_model.repeater(config, ajax_model.request, url, request_model.statBannerSuccess);
            };
        // запрос , котрый получит путь до статистики, функцию успещного выполнения запроса и не успешного.
        ajax_model.request(url, request_model.statBannerSuccess, error);
      }
    }
  },
  // Методы для выполнения задач
  MODELS : {
    // Модель отвечающая за обработку ответов сервера
    REQUEST_MODEL : {
      // Положительный метод на обработку страницы сервером
      // функция принимает ответ сервера и идентификатор интервала
      loadingPageSuccess : function (response, intervalId) {
        // Объявляем конфигурации по умолчанию
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true) {
          var debagList = config.debagList;
        }
        // Очистим интервал
        if (intervalId) {
          clearInterval(intervalId);  
        } else if (debagList){
          debagList.push("2");
        }
        // Запишем конфигурации с сервера
        if (response) {
          if (response.page) {
            config.pageID = response.page;  
          } else if (debagList){
            debagList.push("3");
          }
          if (response.banId) {
            config.ovid = response.banId;    
          } else if (debagList){
            debagList.push("4");
          }
        } else if (debagList) {
          debagList.push("1");
        }
        // Запишем что статус загрузки положительный
        config.pageStatus = 1;
        // Запустим загрузку офферов
        PRESSTAKE_BANNER_CORE.CONTROLLERS.LOAD_CONTROLLER.loadAppList();
      },
      // Положительный метод на скачивание листинка офферов
      // Функция принимает ответ сервера и идентификатор инервала
      loadAppListSuccess : function (response, intervalId) {
        // объявляем конфигурации по умолчанию и модель сборки путей
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            url_builder_model = PRESSTAKE_BANNER_CORE.MODELS.URL_BUILDER_MODEL;
        // то запишем статус загрузки листинга как положительный
        config.appListStatus = 1;
        if (config.debag == true) {
          var debagList = config.debagList;
        }
        // Очистим интервал
        if (intervalId) {
          clearInterval(intervalId);  
        } else if (debagList){
          debagList.push("5");
        }
        
        // Запишем в информацию оффера ссылку на него
        if (response){
          if (response.data){
            response.data.map(function(item, itemKey){
              if (debagList) {
                if (!config.clientID) {
                  debagList.push("8");
                }
                if (!config.bannerID) {
                  debagList.push("9");
                }
                if (!config.pageID) {
                  debagList.push("10");
                }
                if (!item.sitid) {
                  debagList.push("11("+itemKey+")");
                }
                if (!config.ovid) {
                  debagList.push("12");
                }
                if (!config.URL) {
                  debagList.push("13");
                }
              }
              item.link = url_builder_model.getTrackingUrl({
                clientID : config.clientID,
                bannerID : config.bannerID,
                pageID : config.pageID,
                sitID : item.sitid,
                id : item.id,
                ovid : config.ovid,
                URL : config.URL
              });
            });
          } else if (debagList) {
            debagList.push("7");
          }  
        } else if (debagList){
          debagList.push("6");
        }
        
        // Запишем ответ сервера в конфигурации
        config.appList = response;
        PRESSTAKE_BANNER_CORE.CONTROLLERS.INIT_CONTROLLER.init_content();
      },
      statBannerSuccess : function(response, intervalId){
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            debag = config.debag;
        if (debag == true) {
          var debagList = config.debagList;
        }
        if (intervalId) {
          clearInterval(intervalId);  
        } else if (debagList) {
          debagList.push("14");
        }
        if (!response) {
          debagList.push("15");
        }
      }
    },
    // Модель методов для сборки путей с параметрами для запроса
    URL_BUILDER_MODEL : {
      // Функция для формирования пути к скачиванию css файла
      // Функция принимает конфигурации
      getCSSUrl : function (config){
        // Если нет конфигураций то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (config.URL){
          if (!config.URL.TARGET_URL && debagList){
            debagList.push("17");
          }
          if (!config.URL.CSS_URL && debagList){
            debagList.push("18");
          }
        } else if (debagList){
          debagList.push("16");
        }
        // Склеиваем строку по свойствам конфигрураций и возвращаем её
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.CSS_URL;
      },
      // Функция для формирования пути для запроса на парсинг страницы
      // Функция принимает конфигурации
      getParseUrl : function (config) {
        // Если конфигураций нет, то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("19");
        }
        if (!config.bannerID && debagList){
          debagList.push("20");
        }
        if (!config.location && debagList){
          debagList.push("21");
        }
        // Склеиваем строку по свойствам конфигрураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&loc=' + encodeURIComponent(config.location)
                         + '&action=pgst';
        // Возврощаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.PASRSE_URL + attributes;
      },
      // Функция для формирования пути для запроса на отправсление статистики при показе банера
      // Функция принимает конфигурации
      getStatUrl_BannerVisible : function (config) {
        // если конфигураций нет то
        if (!config) {
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("22");
        }
        if (!config.bannerID && debagList){
          debagList.push("23");
        }
        if (!config.pageID && debagList){
          debagList.push("24");
        }
        if (!config.ovid && debagList){
          debagList.push("25");
        }
        // склеиваем строку по свойствам конфигураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&pgid=' + encodeURIComponent(config.pageID)
                         + '&ovid=' + encodeURIComponent(config.ovid)
                         + '&action=vis';
        // возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.STAT_URL + attributes;
      },
      // Функция для формирования пути для запроса на отправление статистики при открытии списка офферов
      // Функция принимаем конфигурации
      getStatUrl_BannerOpen : function (config) {
        // Если нет конфигураций
        if (!config) {
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true) {
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("26");
        }
        if (!config.bannerID && debagList){
          debagList.push("27");
        }
        if (!config.pageID && debagList){
          debagList.push("28");
        }    
        if (!config.ovid && debagList){
          debagList.push("29");
        }    
        // склеиваем строку по свойствам конфигураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&pgid=' + encodeURIComponent(config.pageID)
                         + '&ovid=' + encodeURIComponent(config.ovid);
        // Возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.STAT_URL + attributes;
      },
      // Функция для формирования пути для запроса на отправление статистики при закрытии баннера
      // Функция принимает конфигурации
      getStatUrl_BannerUnvisible : function (config) {
        // Если нет конфигураций то
        if (!config) {
          // Объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag) {
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("30");
        }
        if (!config.bannerID && debagList){
          debagList.push("31");
        }
        if (!config.pageID && debagList){
          debagList.push("32");
        }
        if (!config.ovid && debagList){
          debagList.push("33");
        }
        // Собираем строку по свойствам конфигураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&pgid=' + encodeURIComponent(config.pageID)
                         + '&ovid=' + encodeURIComponent(config.ovid)
                         + '&action=cl';
        // Возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.STAT_URL + attributes;
      },
      // Функция для формирования пути для получения ссылок офферов
      // Функция принимает конфигурации
      getTrackingUrl : function (config) {
        // Если нет конфигураций то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("34");
        }
        if (!config.bannerID && debagList){
          debagList.push("35");
        }
        if (!config.pageID && debagList){
          debagList.push("36");
        }
        if (!config.sitID && debagList){
          debagList.push("37");
        }
        if (!config.ovid && debagList){
          debagList.push("38");
        }
        // склеиваем строку по свойствам конфигураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&pgid=' + encodeURIComponent(config.pageID)
                         + '&item=' + encodeURIComponent(config.sitID)
                         + '&ovid=' + encodeURIComponent(config.ovid);
        // Возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.TRACKING_URL + attributes;
      },
      // Функция для формирования пути для запроса обработки страницы
      // Функция принимает конфигурации
      getCheckLoadingUrl : function (config) {
        // если нет конфигураций то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("39");
        }
        if (!config.bannerID && debagList){
          debagList.push("40");
        }
        if (!config.location && debagList){
          debagList.push("41");
        }
        // Склеиваем строку по свойствам конфигураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&loc=' + encodeURIComponent(config.location)
                         + '&action=pgst';
        // Возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.PASRSE_URL + attributes;
      },
      // Функция для формирования пути для запроса загрузки листинга офферов
      // Функция принимает конфигурации
      getLoadListUrl : function (config) {
        // Если нет конфигураций то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true) {
          var debagList = config.debagList;
        }
        if (!config.clientID && debagList){
          debagList.push("42");
        }
        if (!config.bannerID && debagList){
          debagList.push("43");
        }
        if (!config.pageID && debagList){
          debagList.push("44");
        }
        if (!config.clientOS && debagList){
          debagList.push("45");
        }
        if (!config.ovid && debagList){
          debagList.push("46");
        }
        // Склеиваем строку по свойствам конфигураций
        var attributes = "?clid=" + encodeURIComponent(config.clientID)
                         + '&bid=' + encodeURIComponent(config.bannerID)
                         + '&pgid=' + encodeURIComponent(config.pageID)
                         + '&os=' + encodeURIComponent(config.clientOS)
                         + '&banid=' + encodeURIComponent(config.ovid);
        // Возвращаем полноценную строку дял запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.APPS_URL + attributes;
      },
      // Функция для формирования пути для регистрации пользователя
      // Функция принимает конфигурации
      getSubscribeUrl : function (config) {
        // Если нет конфигураций
        if (!config) {
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.ID && debagList){
          debagList.push("47");
        }
        if (!config.ovid && debagList){
          debagList.push("48");
        }
        if (!config.email && debagList){
          debagList.push("49");
        }
        if (!config.clientOS && debagList){
          debagList.push("50");
        }
        // Склеиваем строку по свойствам конфигураций
        var attributes = "?id=" + encodeURIComponent(config.ID)
                         + '&banid=' + encodeURIComponent(config.ovid)
                         + '&email=' + encodeURIComponent(config.email)
                         + '&os=' + encodeURIComponent(config.clientOS)
                         + '&action=sb';
        // Возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.SUBSCRIBE_URL + attributes;
      },
      // Функция для формирования пути для отписки пользователя
      // Функция принимает конфигурации
      getUnsubscribeUrl : function (config) {
        // Если нет конфигураций то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.ID && debagList){
          debagList.push("51");
        }
        if (!config.ovid && debagList){
          debagList.push("52");
        }
        if (!config.email && debagList){
          debagList.push("53");
        }
        if (!config.clientOS && debagList){
          debagList.push("54");
        }
        // Склеиваем строку по свойствам конфигураций
        var attributes = "?id=" + encodeURIComponent(config.ID)
                         + '&banid=' + encodeURIComponent(config.ovid)
                         + '&email=' + encodeURIComponent(config.email)
                         + '&os=' + encodeURIComponent(config.clientOS)
                         + '&action=unsb';
        // Возвращаем полноценную строку для запроса
        return config.URL.PROTOCOL + config.URL.TARGET_URL + config.URL.SUBSCRIBE_URL + attributes;
      }
    },
    // модель методов для ассихронной связи с сервером
    AJAX_MODEL : {
      // Метод для ассихронной связи с сервером и вызова переданных методов
      // Метод принимает путь для запроса с get данными, метод для успешного соединения и для не удачного соединения
      request : function (url, callback, callbackError, intervalId){
        // Создание объекта соединения и объявляем конфигурации
        var request = new XMLHttpRequest(),
            config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!request && debagList) {
          debagList.push("55");
        }
        if (!url && debagList) {
          debagList.push("57");
        }
        if (!callback && debagList){
          debagList.push("58");
        }
        if (!callbackError && debagList){
          debagList.push("59");
        }
        if (!intervalId && debagList){
          debagList.push("60");
        }
        // Вызод метода для установки соединения по переданному пути
        request.open('GET', url, true);
        // События которые должны вызываться во время соединения
        request.onreadystatechange = function(){
          if (request.readyState != 4) { return false; }
          // Если статус сервера успешен и существует успешный метод то
          if (request.status == 200 && callback) {
            // Преобразуем в JSON ответ сервера
            var response = JSON.parse(request.responseText);
            if (!response && debagList) {
              debagList.push("56");
            }
            // Проверяем есть ли в ответе сервера свойство статуса
            if (response.hasOwnProperty("status")) {
              // Если есть то проверяем положительно ли оно
              if (response.status == config.status.STATUS_OK) {
                // Если положительно то вызываем метод успешного соединения с ответом сервера и идентификатором интервала
                callback(response, intervalId);
                // Если не положительно и если есть метод не успешного соединения то
              } else if (callbackError){
                // Вызываем отрицательный метод
                callbackError();
              }
              //Если нет свойства статус то
            } else {
              // вызовем функцию успешного соединения и передадим ответ сервера и идентификатор интервала
              callback(response, intervalId);
            }
            // Если ответ сервера не успешен и если существует метод неуспешного соединения то
          } else if (callbackError){
            // Вызываем этот метод
            callbackError();
          }
        };
        // Вызов метода соединения
        request.send();
      },
      // Функция повторения запроса
      // Функция принимает конфигурации, функцию для ассихронной связи, путь с параметрами запроса, функцию при удачном соединении и не удачном
      repeater : function (config, ajax_function, url, callback, callbackError) {
        var debag = config.debag || PRESSTAKE_BANNER_CORE.CONFIG.debag;
        if (debag == true){
          var debagList = config.debagList || PRESSTAKE_BANNER_CORE.CONFIG.debagList;
        }
        if (!ajax_function && debagList){
          debagList.push("61");
        }
        if (!callback && debagList){
          debagList.push("62");
        }
        if (!callbackError && debagList){
          debagList.push("63");
        }
        if (!url && debagList){
          debagList.push("64");
        }
        // Объявляем интервал, запускаем его и записываем его индентификатор
        var intervalId = setInterval((function(){
          // Если в области видимости нет свойства tick то
          if (!this.tick) {
            // Создаём его и присваем ему значение 1
            this.tick = 1;
            // Если оно есть то
          } else {
            // Прибавляем к нему 1
            this.tick ++;
          }
          if (!config.repeatCounter && debagList) {
            debagList.push("65("+intervalId+", "+tick+")");
          }
          if (!url && debagList) {
            debagList.push("66("+intervalId+", "+tick+")");
          }
          if (!callback && debagList) {
            debagList.push("67("+intervalId+", "+tick+")");
          }
          if (!callbackError && debagList) {
            debagList.push("68("+intervalId+", "+tick+")");
          }
          if (!config.repeatTimeout && debagList){
            debagList.push("69("+intervalId+", "+tick+")"); 
          }
          // Вызываем ассихронную функцию и передаём в неё путь, удачную функцию, неудачную, идентификатор интервала
          ajax_function(url, callback, callbackError, intervalId);
          // Если интервал прошёл больше или равное количество вызовов описанных в конфигурациях то
          if (this.tick >= config.repeatCounter) {
            // Очищаем интервал
            clearInterval(intervalId);
          }
        // Прикрепляем к функции интервала пустой объект, который будет служить его областью видимости, а также задаём тайминг из конфигураций
        }).bind(new Object), config.repeatTimeout);
        // Возвращаем идентификатор интервала
        return intervalId;
      }
    },
    // Модель методов для операций над конфигурациями приложения
    CONFIG_MODEL : {
      // Определение протокола клиента
      getProtocol : function (){
        // Запись протокола клиента
        var protocol = document.location.protocol,
            config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true) {
          var debagList = config.debagList;
        }
        if (!protocol && debagList){
          debagList.push("70");
        }
        // Если протокол защищённый то возвращаем https:// если нет то http://
        if ('https:' === protocol) {
          return "https://";
        } else {
          return "http://";
        }
      },
      // Получение операционной системы клиента
      getClientOS : function () {
        // Получение строки с иформацией об аппаратуре и програмном обеспечении клиента
        var userAgent = navigator.userAgent,
            config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!userAgent && debagList){
          debagList.push("71");
        }
        // Если поиск по регулярному выродению выполнен успешно (есть вхождения)
        if (userAgent.match(/Android/i)) {
          // То возвращаем что это Android
          return 'android';
          // Если входений нет то ищем другой вариант для apple стройств
        } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
          // Если есть схожесть то возвращаем apple
          return 'ios';
          // Если нет обоих условий то возвращаем other
        } else {
          return 'other';
        }
      },
      // Получение кофиогураций из атребутов HTML узлов, функция принимает в себя объект конфигураций
      getDOMConfig : function (config) {
        // Если нет объекта конфигураций то
        if (!config) {
          // объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.loaderID && debagList) {
          debagList.push("72");
        }
        // Записываем переменную - дискриптор на HTML узер загрузчика по идентификатору из конфигураций
        var loaderDOM = document.getElementById(config.loaderID);
        if(!loaderDOM && debagList) {
          debagList.push("73");
        }
        if (!loaderDOM.getAttribute("data-bid") && debagList){
          debagList.push("74");
        }
        if (!loaderDOM.getAttribute("data-clid") && debagList){
          debagList.push("75");
        } 
        // Записываем в конфигурации атребуты HTML узла : номер баннера и номер клиента
        config.bannerID = loaderDOM.getAttribute("data-bid");
        config.clientID = loaderDOM.getAttribute("data-clid");
        // Возвращаем положительный результат
        return true;
      },
      // Функция для получения скролла клиента
      getScroll : function () {
        // Объявление конфигураций, вертикального скролла окна, высоту html документа, высоту сколла, высчитываем процент скролла
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            windowScrollTop = window.scrollY,
            clientHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight),
            scrollHeight = document.documentElement.scrollHeight,
            scroll = (windowScrollTop * 100) / clientHeight;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!windowScrollTop && debagList){
          debagList.push("76");
        }
        if (!clientHeight && debagList){
          debagList.push("77");
        }
        if (!scrollHeight && debagList){
          debagList.push("78");
        }
        // Если процент скролла равен 0 и высота скролла меньше или равна высоте окна
        if (scroll == 0 && scrollHeight <= window.innerHeight){
          // То процент скролла равен 100
          scroll = 100;
        }
        // Записываем процент скролла в конфигурации
        config.scroll = scroll;
      },
      // Функция для получения зума баннера
      getZoom : function () {
        // бъявляем конфигурации и ширину окна клиента
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            width = window.innerWidth;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!width && debagList){
          debagList.push("79");
        }
        // Записываем зум для баннера в конфигурации
        config.zoom = width / 700;
      },
      // Функция для получения левого отступа баннера
      getBannerLeft : function(){
        // Объявляем конфигурации, ширину html окумента, горизонтальный скрол окна
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            clientWidth = document.documentElement.clientWidth,
            scrollLeft = window.scrollX;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!clientWidth && debagList){
          debagList.push("80");
        }
        if (!scrollLeft && debagList){
          debagList.push("81");
        }
        // Записываем процент отступа от левого края для баннера
        config.bannerLeft = (scrollLeft * 100) / clientWidth;
      },
      // Функция для получения отступа от нижнего края псевдо видимого экрана клиента
      getBannerBottom : function(){
        // Объявляем конфигурации, высоту тела html документа, вертикальный скролл окна
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            clientHeight = document.body.clientHeight,
            scrollTop = window.scrollY;
        //console.log((scrollTop * 100) / clientHeight);
        // Записываем процентный отступ от нижнего края псевдо видимой области экрана клиента для баннера
        config.bottom = 0;
      }
    },
    // Модель отрисовки и обработки событий
    VIEW_MODEL : {
      // Функция для формирования html узлов баннера
      // функция принимает конфигурации
      create_banner : function (config){
        // Если нет конфигураций то
        if (!config) {
          // Объявляются стандартные конфигурации
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag){
          var debagList = config.debagList;
        }
        // Обявляем объект - ответ сервера на загрузку листинга офферов
        var response = config.appList,
            // создаём html узел для контейнера всего баннера
            banner = document.createElement('noindex'),
            // создаём html узел для главной области баннера
            banner_main = document.createElement("div"),
            // создаём html узел для контейнера листинга офферов
            banner_list = document.createElement("div"),
            // создаём html узел для контейнера логотипа
            baner_main_logo = document.createElement("div"),
            // создаём html узел для контейнера текстов в главной области
            banner_main_text = document.createElement("div"),
            // создаём html узел для крестика в главной области
            banner_main_close = document.createElement("input"),
            // создаём html узел для крестика в листинге офферов
            banner_list_close = document.createElement("div"),
            // создаём html узел для контейнера с горизонтальным скролом в листинге офферов
            banner_list_scroll = document.createElement("div"),
            // создаём html узел для верхнего текста в главной области
            banner_main_text_top = document.createElement("div"),
            // создаём html узел для верхнего текста при открытии листинга офферов в главной области
            banner_main_text_top_open = document.createElement("div"),
            // создаём html узел для среднего текста в главной области
            banner_main_text_middle = document.createElement("div"),
            // создаём html узел для среднего тестка при отрытии листинга офферов в главной области
            banner_main_text_middle_open = document.createElement("a"),
            // создаём html узел для нижнего текста в главной области
            banner_main_text_bottom = document.createElement("div"),
            // создаём html узел для контейнера офферов
            banner_list_scroll_list = document.createElement("div"),
            // создаём html узел для ссылки в главной области
            banner_main_link = document.createElement("a"),
            // создаём html узел для цветного текста в нижнем тексте главной области
            banner_main_text_bottom_colored = document.createElement("a");

        if (!response && debagList){
          debagList.push("82");
        }

        // добавляем класс к контейнеру баннера
        banner.classList.add("pt-banner");
        // добавляеам идентификатор для контейнера баннера
        banner.id = config.bannerSpaceID;

        if (!config.bannerSpaceID && debagList){
          debagList.push("83");
        }

        // Добавляем класс для главной области баннера
        banner_main.classList.add("pt-banner-main");
        // Добавляем идентификатор для главной области баннера
        banner_main.id = "pt-banner-main";
        // Добавляем класс для логотипа в главной области
        baner_main_logo.classList.add("pt-banner-logo-wrapper");
        // Добавляем класс для контейнера для текста в главной области
        banner_main_text.classList.add("pt-banner-text-wrapper");
        // Добавляем класс для верхнего текста в главной области баннера
        banner_main_text_top.classList.add("pt-banner-text-top");
        // Добавляем класс для верхнего текста при открытии листинга офферов в главной области баннера
        banner_main_text_top_open.classList.add("pt-banner-text-top-open");
        // Добавляем класс для среднего текста главной области баннера
        banner_main_text_middle.classList.add("pt-banner-text-middle");
        // Добавляем класс для среднего текста при открытии листинга офферов в главной области баннера
        banner_main_text_middle_open.classList.add("pt-banner-text-middle-open");
        // Добавляем класс для нижнего текста в главной области баннера
        banner_main_text_bottom.classList.add("pt-banner-text-bottom");
        // Добавляем класс для цветного текста в нижнем тексте в главной области баннера
        banner_main_text_bottom_colored.classList.add("pt-banner-text-bottom__colored");
        // Добавляем класс для ссылки в главной области баннера
        banner_main_link.classList.add("pt-banner-link");
        // Добавляем класс для крестика в главной области баннера
        banner_main_close.classList.add("pt-banner-close");
        // Добавляем идентификатор для крестика в главной области баннера
        banner_main_close.id = "pt-banner-close_banner";
        // Добавляем класс для контейнера листинга офферов
        banner_list.classList.add("pt-banner-list-wrapper");
        // Добавляем класс для крестика в контейнере листинга офферов
        banner_list_close.classList.add("pt-banner-close");
        // Добавляем идентификатор для крестика в контейнере листинга офферов
        banner_list_close.id = "pt-banner-close__list";
        // Добавляем класс для области с горизонтальным скроллом в контейнере листинга офферов
        banner_list_scroll.classList.add("pt-banner-list-scroll-wrapper");
        // Добавляем класс для контейнера офферов
        banner_list_scroll_list.classList.add("pt-banner-list");

        // Добавляем класс для контейнера баннера из конфигураций
        banner.classList.add(config.bannerClasses[response.templateType]);

        if (!config.bannerClasses && debagList){
          debagList.push("84");
        }
        if(!response.templateType && debagList){
          debagList.push("85");
        }

        // добавляем текстовый узел для верхнего текста главной области баннера
        banner_main_text_top.innerHTML = "Лучшие цены в он-лайн магазинах";
        // добавляем текстовый узел для вернего текста при открытии листинга офферов для главной области баннера
        banner_main_text_top_open.innerHTML = "Посмотреть больше предложений";
        // добавляем текстовый узел для среднего текста главной области баннера
        banner_main_text_middle.innerHTML = "Где купить товары из этой статьи?";
        // добавляем url аттребут для среднего текста при открытии листинга офферов для главной области баннера
        banner_main_text_middle_open.href = "http://www.presstake.com/landing/";
        // добавляем текстовый узел для среднего текста при открытии листинга офферов для главной области баннера
        banner_main_text_middle_open.innerHTML = "PressTake.com";
        // добавляем текстовый узел для нижнего текста для главной области баннера
        banner_main_text_bottom.innerHTML = "powered by";
        // добавляем текстовый узел для цветного текста в нижнем тексте для главной области баннера
        banner_main_text_bottom_colored.innerHTML = "PressTake";
        // добавляем url аттребут для цветного текста в нижнем тексте для главной области баннера
        banner_main_text_bottom_colored.href = "http://www.presstake.com/landing/";
        // добавляем текстовый узел для ссылки в главной области баннера
        banner_main_link.innerHTML = "Узнать!"

        // добавляем в нижний текст главной области баннера цветной текст
        banner_main_text_bottom.appendChild(banner_main_text_bottom_colored);
        // Добавляем в текстовый контейнер главной области баннера верхний текст
        banner_main_text.appendChild(banner_main_text_top);
        // Добавляем в текстовый контейнер главной области баннера верхний текст при открытии листинга офферов
        banner_main_text.appendChild(banner_main_text_top_open);
        // Добавляем в текстовый контейнер главной области баннера средний текст
        banner_main_text.appendChild(banner_main_text_middle);
        // Добавляем в текстовый контейнер главной области баннера средний текст при открытии листинга офферов
        banner_main_text.appendChild(banner_main_text_middle_open);
        // Добавляем в текстовый контейнер главной области баннера нижний текст
        banner_main_text.appendChild(banner_main_text_bottom);

        // Добавляем в главную область баннера логотип
        banner_main.appendChild(baner_main_logo);
        // Добавляем в главную область баннера текстовый контейнер
        banner_main.appendChild(banner_main_text);
        // Добавляем в главную область баннера ссылку
        banner_main.appendChild(banner_main_link);
        // Добавляем в главную область баннера крестик
        banner_main.appendChild(banner_main_close);

        if (!response.data && debagList){
          debagList.push("86");
        }

        // Объявляем цыкл по количеству офферов из ответа сервера каджый оффер будет как переменная item
        response.data.map(function(item, itemKey){
          // объявляем html узел для ячейки оффера
          var banner_list_scroll_list_item = document.createElement("div"),
              // объявляем html узел для контейнера картинки в ячейке оффера
              banner_list_scroll_list_item_image = document.createElement("a"),
              // объявляем html узел для заголовка оффера
              banner_list_scroll_list_item_title = document.createElement("div"),
              // объявляем html узел для цены оффера
              banner_list_scroll_list_item_price = document.createElement("div"),
              // объявляем html узел для картинки оффера
              banner_list_scroll_list_item_image_img = document.createElement("img"),
              // объявляем html узел для ссылки на оффер
              banner_list_scroll_list_item_link = document.createElement("a"),
              // объявляем html узел для кнопки ссылки на оффер
              banner_list_scroll_list_item_button = document.createElement("a");

          // Добавляем класс для ячейки оффера
          banner_list_scroll_list_item.classList.add("pt-banner-list-item");
          // Добавляем класс для контейнера картинки оффера
          banner_list_scroll_list_item_image.classList.add("pt-banner-list-image-wrapper");

          if (!item.link && debagList) {
            debagList.push("87("+itemKey+")");
          }

          // Добавляем url аттребут для контейнера картинки оффера
          banner_list_scroll_list_item_image.href = item.link;
          // Добавляем класс для картинки оффера
          banner_list_scroll_list_item_image_img.classList.add("pt-banner-list-image");
          // Добавляем класс для ссылки на оффер
          banner_list_scroll_list_item_link.classList.add("pt-banner-list-link");
          // Добавляем класс для заголовка оффера
          banner_list_scroll_list_item_title.classList.add("pt-banner-item-title");
          // Добавляем класс для цены оффера
          banner_list_scroll_list_item_price.classList.add("pt-banner-item-price");
          // Добавляем класс для ссылки - кнопки оффера
          banner_list_scroll_list_item_button.classList.add("pt-banner-item-shop_button");

          if (!item.itarget && debagList){
            debagList.push("88("+itemKey+")");
          }

          // Если платформа оффера для гугл плей то
          if (item.itarget.google_play == 1){
            // добавляем класс к ссылке - кнопке для гугл плей
            banner_list_scroll_list_item_button.classList.add("pt-banner-item-shop_button__google");
            // если нет и если таргет для аппл сторе то
          } else if (item.itarget.appstore == 1){
            // добавляем класс к ссылке - кнопке для аппл сторе
            banner_list_scroll_list_item_button.classList.add("pt-banner-item-shop_button__apple");
            // если нет то
          } else {
            // добавляем текстовый узел в ссылку - кнопку
            banner_list_scroll_list_item_button.innerHTML = "В магазин";
          }

          if (!item.image && debagList){
            debagList.push("89("+itemKey+")");
          }

          // добавляем url ттребут для картинки оффера
          banner_list_scroll_list_item_image_img.src = item.image;
          // добавляем альтернативный текст для картинки
          banner_list_scroll_list_item_image_img.alt = "";
          // Добавляем url атрребут для ссылки оффера
          banner_list_scroll_list_item_link.href = item.link;
          // добавляем текстовый узел для ссылки на оффер, который состоит из корневого каталога оффера
          //banner_list_scroll_list_item_link.innerHTML = item.link.match(/[aA-zZ]*\.[aA-zZ]*/);

          if (!item.linkName && debagList){
            debagList.push("90("+itemKey+")");
          }

          banner_list_scroll_list_item_link.innerHTML = item.linkName;
          // добавляем текстовый узел для заголовка оффера

          if (!item.name && debagList){
            debagList.push("91("+itemKey+")");
          }

          banner_list_scroll_list_item_title.innerHTML = item.name;
          // добавляем текстовый узел для цены оффера

          if (!item.price && debagList){
            debagList.push("92("+itemKey+")");
          }

          banner_list_scroll_list_item_price.innerHTML = item.price;
          // добавляем url атрребут для ссылки - кнопки на оффер
          banner_list_scroll_list_item_button.href = item.link;

          // Добавляем в контейнер картинки картинку оффера
          banner_list_scroll_list_item_image.appendChild(banner_list_scroll_list_item_image_img);

          if (!item.hasOwnProperty("alternativeText") && debagList){
            debagList.push("93("+itemKey+")");
          }

          // Если есть альтернативный текст оффера то
          if (item.hasOwnProperty("alternativeText")) {
            // объявляем html узел для контейнера альтернативного текста
            var banner_list_scroll_list_item_alternative = document.createElement("div"),
                // объявляем html узел для верхнего альтернативного текста
                banner_list_scroll_list_item_alternative_top = document.createElement("div"),
                // объявляем html узел для нижнего альтернативного текста
                banner_list_scroll_list_item_alternative_bottom = document.createElement("div");

            // добавление класса для ячейки оффера
            banner_list_scroll_list_item.classList.add("pt-banner-list-item__alternative");
            // добавление класса для контейнера альтернативного текста
            banner_list_scroll_list_item_alternative.classList.add("pt-banner-alternative_text");
            // добавление класса для верхнего альтернативного текста
            banner_list_scroll_list_item_alternative_top.classList.add("pt-banner-alternative_text-top");
            // добавление класса для нижнего альтернативного текста
            banner_list_scroll_list_item_alternative_bottom.classList.add("pt-banner-alternative_text-bottom");

            if (!item.alternativeText.top && debagList){
              debagList.push("94("+itemKey+")");
            }
            if (!item.alternativeText.bottom && debagList){
              debagList.push("95("+itemKey+")"); 
            }

            // добавление текстового узла для верхенего альтернативного текста из ответа сервера
            banner_list_scroll_list_item_alternative_top.innerHTML = item.alternativeText.top;
            // добавление текстового узла для нижнего альтернативного текста из ответа сервера
            banner_list_scroll_list_item_alternative_bottom.innerHTML = item.alternativeText.bottom;

            // добавление в контейнер альтернативного текста верхнего текста
            banner_list_scroll_list_item_alternative.appendChild(banner_list_scroll_list_item_alternative_top);
            // добавление в контейнер альтернативного текста нижнего текста
            banner_list_scroll_list_item_alternative.appendChild(banner_list_scroll_list_item_alternative_bottom);
            // добавление в ячейку оффера контейнера альтернативного текста
            banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_alternative);
          }

          // добавление в ячейку оффера контейнера картинки
          banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_image);
          // добавление в ячейку оффера ссылки
          banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_link);
          // добавление в ячейку оффера заголовка
          banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_title);

          if (!item.hasOwnProperty("description") && debagList){
            debagList.push("96("+itemKey+")");
          }

          // Если есть описание оффера то
          if (item.hasOwnProperty("description")) {
            // объявление html узла для описания оффера
            var banner_list_scroll_list_item_description = document.createElement("div");

            // Добавление класса к описанию оффера
            banner_list_scroll_list_item_description.classList.add("pt-banner-item-description");

            // добавление текстового узла в описание оффера
            banner_list_scroll_list_item_description.innerHTML = item.description;
            // добавление в ячейку оффера описания
            banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_description);
          }

          // добавление в ячейку оффера цены
          banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_price);
          // добавление в ячейку оффера кнопки - ссылки
          banner_list_scroll_list_item.appendChild(banner_list_scroll_list_item_button);
          // добавление в контейнер офферов ячейки оффера
          banner_list_scroll_list.appendChild(banner_list_scroll_list_item);
        });

        // добавление в область со скроллом контейнер офферов
        banner_list_scroll.appendChild(banner_list_scroll_list);

        // Если тип баннера 2 или 5 то
        if (response.templateType == 2 || response.templateType == 5 || response.templateType == 0) {
          // объявление html узла для шапки листинга офферов
          var banner_list_header = document.createElement("div"),
              // объявление html узла для контейнера селекора в шапке
              banner_list_header_selector = document.createElement("div"),
              // объявление html узла для описания селекора в шапке
              banner_list_header_selector_description = document.createElement("div"),
              // объявление html узла для описания контейнера ресурсов в шапке
              banner_list_header_source = document.createElement("div"),
              // объявление html узла для вступления ресурса
              banner_list_header_source_before = document.createElement("div"),
              // объявление html узла для названия ресурса
              banner_list_header_source_after = document.createElement("div"),
              // объявление html узла для селекора в шапке
              banner_list_header_selector_selector = document.createElement("select");

          // добавление класса для шапки
          banner_list_header.classList.add("pt-banner-list-header");
          // добавление класса для контейнера селектора
          banner_list_header_selector.classList.add("pt-banner-list-header-selector-wrapper");
          // добавление класса для описания селектора
          banner_list_header_selector_description.classList.add("pt-banner-list-header-description");
          // добавление класса для селетора в шапке
          banner_list_header_selector_selector.classList.add("pt-banner-list-header-selector");
          // добавление идентификатора для селекора в шапке
          banner_list_header_selector_selector.id = "pt-banner-selector";
          // добавление класса для контейнера ресурса
          banner_list_header_source.classList.add("pt-banner-list-header-source-wrapper");
          // добавление класса для вступления ресурса
          banner_list_header_source_before.classList.add("pt-banner-list-header-source-before");
          // добавление класса для ресурса
          banner_list_header_source_after.classList.add("pt-banner-list-header-source-after");

          // добавление текстового узла для описания селекора
          banner_list_header_selector_description.innerHTML = "Актуально для ";
          // добавление текстового узла для вступления ресурса
          banner_list_header_source_before.innerHTML = "По данным";

          if (!response.shipperName && debagList){
            debagList.push("97");
          }

          // добавление текстового узла для ресурса
          banner_list_header_source_after.innerHTML = response.shipperName;

          // объявляем html узел для опции селектора по умолчанию
          var banner_list_header_selector_selector_option = document.createElement("option");
          // Добовляем класс для опции селектора
          banner_list_header_selector_selector_option.classList.add("pt-banner-list-header-selector-option");
          // Добавляем атребут для отображения по умолчанию
          banner_list_header_selector_selector_option.setAttribute("selected", "");

          if (!response.geo.name && debagList){
            debagList.push("98");
          }

          // Добавляем название города
          banner_list_header_selector_selector_option.innerHTML = response.geo.name;
          // Добавляем опцию в селект
          banner_list_header_selector_selector.appendChild(banner_list_header_selector_selector_option);

          if (!response.hasOwnProperty("cities") && debagList){
            debagList.push("99");
          }

          // Если есть список городов в ответе сервера то
          if(response.hasOwnProperty("cities")){
            // Объявляем цыкл до количества городов в ответе сервера
            response.cities.map(function(city, cityKey){
              // объявляем html узел для опции селектора
              var banner_list_header_selector_selector_option = document.createElement("option");

              if (!city.id && debagList){
                debagList.push("100("+cityKey+")");
              }
              if (!city.name && debagList){
                debagList.push("101("+cityKey+")"); 
              }

              // Добовляем класс для опции селектора
              banner_list_header_selector_selector_option.classList.add("pt-banner-list-header-selector-option");
              // Добовляем атребут с идентификатором города в базе
              banner_list_header_selector_selector_option.setAttribute("data-cityID", city.id);
              // добовляем текстовый узер опции из ответа сервера
              banner_list_header_selector_selector_option.innerHTML = city.name;
              // добавляем опцию в селектор
              banner_list_header_selector_selector.appendChild(banner_list_header_selector_selector_option);
            });
          }

          // добавляем в контейнер селетора описание
          banner_list_header_selector.appendChild(banner_list_header_selector_description);
          // добавляем в контейнер селекора селектор
          banner_list_header_selector.appendChild(banner_list_header_selector_selector);
          // добавляем в контейнер ресурса вступление
          banner_list_header_source.appendChild(banner_list_header_source_before);
          // добавляем в контейнер ресурса ресурс
          banner_list_header_source.appendChild(banner_list_header_source_after);
          // добавляем в шапку контейнер селектора
          banner_list_header.appendChild(banner_list_header_selector);
          // добавляем в шапку контейнер ресурса
          banner_list_header.appendChild(banner_list_header_source);
          // добавляем в контейнер листинга офферов шапку
          banner_list.appendChild(banner_list_header);
        }

        // добавляем в контейнер листинга офферов крестик
        banner_list.appendChild(banner_list_close);
        // добавляем в контейнер листинга офферов область с горизонтальным скроллом
        banner_list.appendChild(banner_list_scroll);
        // добавляем в контейнер баннера контейнер листинга офферов
        banner.appendChild(banner_list);
        // добавляем в контейнер баннера главную область
        banner.appendChild(banner_main);
        // добавляем в тело документа контейнер баннера
        document.body.appendChild(banner);
      },
      // функция для подключения стилей
      // Функция принимает путь до файла стилей
      createCss : function(url){
        // Объявляется тег стилей и шапка страницы
        var css = document.createElement("link"),
            head = document.head,
            config = PRESSTAKE_BANNER_CORE.CONFIG;

        if (config.debag == true){
          var debagList = config.debagList;
        }
        // Добавляем свойство указания на стилевой файл к тегу стилей
        css.rel = "stylesheet";
        // Добавляет свойство для обозначения пути до стилевого файла и приравниваем путь полученый при вызове
        if (!url && debagList){
          debagList.push("102");
        }
        css.href = url;
        // Добавляем в шапку страницы тег для стилей
        head.appendChild(css);
      },
      // Функция для открытия баннера
      // Функция принимает конфигурации
      showBanner : function (config) {
        // Если нет конфигураций то
        if(!config) {
          // Объявляем конфигурации равными по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.bannerSpaceID && debagList){
          debagList.push("103");
        }
        // Объявляем html узел баннера
        var banner = document.getElementById(config.bannerSpaceID);
        // Добавляем в узел класс для открытия баннера
        banner.classList.add("pt-banner-show");
        // Вызываем дополнительные функции для данного события
        PRESSTAKE_BANNER_CORE.CONTROLLERS.EVENT_CONTROLLER.showBannerEvent();
      },
      // Функция для закрытия баннера
      // Функция принимает конфигурации
      hideBanner : function (config) {
        // Если нет конфигураций то
        if(!config){
          // Объявляем конфигурации равными по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.bannerSpaceID && debagList){
          debagList.push("104");
        }
        // Объявляем html узел баннера
        var banner = document.getElementById(config.bannerSpaceID);
        // Удаляем из html узела баннера класс для открытия баннера
        banner.classList.remove("pt-banner-show");
        // Вызываем дополнительные функции для этого события
        PRESSTAKE_BANNER_CORE.CONTROLLERS.EVENT_CONTROLLER.hideBannerEvent();
      },
      // Функция для открытия листинга офферов
      // Функция принимает конфигурации
      openList : function (config){
        // Если нет конфигураций то
        if(!config){
          // Объявляем конфигурации равными по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.bannerSpaceID && debagList){
          debagList.push("105");
        }
        // Объявляем html узел баннера
        var banner = document.getElementById(config.bannerSpaceID);
        // Добавляем в него класс для открытия списка офферов
        banner.classList.add("pt-banner-open");
        // Вызываем дополнительные функции для данного события
        PRESSTAKE_BANNER_CORE.CONTROLLERS.EVENT_CONTROLLER.bannerMainClickFirst();
        PRESSTAKE_BANNER_CORE.CONTROLLERS.EVENT_CONTROLLER.openBannerEvent();
      },
      // Функция закрытия листинга офферов
      // Функция принимает конфигурации
      closeList : function (config){
        // Если нет конфигураций то
        if(!config){
          // Объявляем конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.bannerSpaceID && debagList){
          debagList.push("106");
        }
        // Объявляем html узел баннера
        var banner = document.getElementById(config.bannerSpaceID);
        // Удаляем из него класс для открытия списка офферов
        banner.classList.remove("pt-banner-open");
        // Вызываем дополнительные функции для данного события
        PRESSTAKE_BANNER_CORE.CONTROLLERS.EVENT_CONTROLLER.bannerMainClickSecond();
      },
      // Функция которая возникает при скроллинге страницы
      scrollEvent : function () {
        // Если нет конфигураций то
        if (!config) {
          // Объявляем конфигурации равными по усмолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!config.scroll && debagList){
          debagList.push("107");
        }
        if (!config.clientOS && debagList){
          debagList.push("108");
        }
        // если скролл страницы больше 25 процентов и операционная система клиента не в составе категории другие то
        if (config.scroll > 25 && config.clientOS != "other") {
          // Вызываем функцию открытия баннера
          PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER.showBanner();
        }
      },
      // Функция которая срабатывает при зумировании страницы
      // Функция принимает конфигурации
      zoomEvent : function (config){
        // Объявляются конфигурации и html узел баннера
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            banner = document.getElementById(config.bannerSpaceID);
        if (config.debag) {
          var debagList = config.debagList;
        }
        if (!config.zoom && debagList){
          debagList.push("109");
        }
        if (!config.left && debagList){
          debagList.push("110");
        }
        if (!config.bottom && debagList){
          debagList.push("111");
        }
        // Добавление зума в стили баннера из конфигураций
        banner.style.zoom = config.zoom;
        // Добавление отступа слева в стили баннера из конфигураций + %
        banner.style.left = config.bannerLeft + "%";
        // Добавление отступа снизу в стили баннера из конфигураций + %
        banner.style.bottom = config.bannerBottom + "%";
      },
      // Функция для открытия листинга офферов при клике на главную область баннера
      // Функция принимает событие
      bannerMainClickFirstEvent : function (event) {
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        // Корректировка события если необходимо
        event = event || window.event;
        if (!event && debagList){
          debagList.push("112");
        }
        // Объявление DOM объекта события
        var target = event.target || event.srcElement;
        if (!target && debagList){
          debagList.push("113");
        }
        if (!target.id && debagList){
          debagList.push("114");
        }
        // Если у DOM объекта нет идентификатора или идентификатор не равен кнопке закрытия то
        if (!target.id || target.id != "pt-banner-close_banner") {
          // Открывает листинг офферов
          PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER.openList();
        }
      },
      // Функция для закрытия листинга офферов при клике на главную облать баннера
      bannerMainClickSecondEvent : function (event){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if(config.debag == true){
          var debagList = config.debagList;
        }
        // Корректировака события если нужно
        event = event || window.event;
        // Объявление DOM бъекта события
        var target = event.target || event.srcElement;
        if (!target && debagList){
          debagList.push("115");
        }
        if (!target.id && debagList){
          debagList.push("116");
        }
        // Если у DOM объекта события нет идентификатора или идентификатор не равен кнопке закрытия то
        if (!target.id || target.id != "pt-banner-close_banner") {
          // Закрываем листинг офферов
          PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER.closeList();
        }
      },
      // Функция для закрытия баннера при клике на крестик в главной области баннера
      bannerMainCloseButtonEvent : function(){
        // Закрываем баннер
        PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER.hideBanner();
      },
      // Функция для закрытия листинга офферов при нажатии на крестик в листинге офферов
      bannerListCloseButtonEvent : function(){
        // Закрываем листинг офферов
        PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER.closeList();
      },
      // Функция для добавления события на скролл
      // Функция принимает событие
      addWindowScrollEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("117");
        }
        // Добавление события на скролл
        window.addEventListener("scroll", action);
      },
      // Функция для добавления события на зумирование окна
      // Функция принимает событие
      addWindowZoomEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("118");
        }
        // Добавление события на масштабирование области экрана
        window.addEventListener("resize", action);
        // Добавление события на движение пальцем по экрану
        window.addEventListener("touchmove", action);
      },
      // Функция для добавления события на нажатие на главную область баннера
      // Функция принимает событие
      addBannerMainClickEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("119");
        }
        // Объявление html узла главной области баннера
        var mainBanner = document.getElementById("pt-banner-main");
        // Добавление события при клике
        mainBanner.addEventListener("click", action);
      },
      // Функция добавления события при клике на крестик в главной области баннера
      // Функция принимает событие
      addBannerMainCloseButtonEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("120");
        }
        // Объявление html узел крестика в главной области баннера
        var button = document.getElementById("pt-banner-close_banner");
        // Добавляем событие на клик по html узлу
        button.addEventListener("click", action);
      },
      // Функция для добавления события на клие в крестик в листинге офферов
      // Функция принимает событие
      addBannerListCloseButtonEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("121");
        }
        // Объявление html узла крестика в листинге офферов
        var button = document.getElementById("pt-banner-close__list");
        // Добавление события на клик
        button.addEventListener("click", action);
      },
      // Функция для удаления события при скроллинге
      // Функция принимает событие
      removeWindowScrollEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("122");
        }
        // Удаление события
        window.removeEventListener("scroll", action);
      },
      // Функция для удаления события при зуме окна
      // Функция принимает событие
      removeWindowZoomEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("123");
        }
        // Удаление события при масштабировании окна
        window.removeEventListener("resize", action);
        // Удаление события при движении пальцем
        window.removeEventListener("touchmove", action);
      },
      // Функция для удаления события при клике на гланую область баннера
      // Функция принимает событие
      removeBannerMainClickEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("124");
        }
        // Объявляем html узел главной области баннера
        var mainBanner = document.getElementById("pt-banner-main");
        // Удаляем событие при клике
        mainBanner.removeEventListener("click", action);
      },
      // Функция удаляет событие при клике на крестик в главной области баннера
      // Функция принимает событие
      removeBannerMainCloseButtonEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("125");
        }
        // Объявляем html узел крестика в главной области баннера
        var button = document.getElementById("pt-banner-close_banner");
        // Удаляем событие
        button.removeEventListener("click", action);
      },
      // Функция для удаления события при клике на крестик в листинге офферов
      // Функция принимает событие
      removeBannerListCloseButtonEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        if (config.debag == true){
          var debagList = config.debagList;
        }
        if (!action && debagList){
          debagList.push("126");
        }
        // Объявление html узла крестика в листинге офферов
        var button = document.getElementById("pt-banner-close__list");
        // Удаление события
        button.removeEventListener("click", action);
      }
    }
  }
};

// window.addEventListener("DOMContentLoaded", function(){
//   PRESSTAKE_BANNER_CORE.init({
//     URL: {
//       TARGET_URL : window.location.host + "/",
//       PASRSE_URL : "requests/parse",
//       APPS_URL : "requests/apps",
//       STAT_URL : "requests/stat",
//       TRACKING_URL : "requests/track",
//       CSS_URL : "css/style.css"
//     }
//   });
// });
