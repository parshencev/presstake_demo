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
      STATUS_OK_2 : 200,
      STATUS_OK_3 : "success",
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
            view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config = PRESSTAKE_BANNER_CORE.CONFIG;
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
        view_controller.addBannerListTouchStartEvent();
        view_controller.addBannerListTouchMoveEvent();
        view_controller.addBannerListTouchEndEvent();
        view_controller.addBannerListMouseDownEvent();
        view_controller.addDocumentMouseMoveEvent();
        view_controller.addDocumentMouseUpEvent();
        // Добавление события на скролл
        view_controller.addWindowScrollLeftEvent();
        // Добавление событий на изменение зума
        view_controller.addWindowZoomEvent();
        // Добавление события на открытие списка офферов при клике
        view_controller.addBannerMainFirstEvent();
        // Добавление события на закрытие всего баннера при клике на крестик
        view_controller.addBannerMainCloseButtonEvent();
        // Добавление события на закрытие списка офферов при клике на крестик
        view_controller.addBannerListCloseButtonEvent();
        if (config.device == "desktop"){
          view_controller.addBannerListScrollEvent();
        }
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
        // Записываем тип устройства клиента в конфигурации
        config_model.getDeviceType();
        // Записываем ориентацию устройства
        config_model.getDeviceOrientation();
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
      addBannerListScrollEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addBannerListScrollEvent(view_model.bannerListScrollEvent);
      },
      addBannerListTouchStartEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addBannerListTouchStartEvent(view_model.bannerListTouchStartEvent);
      },
      addBannerListTouchMoveEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addBannerListTouchMoveEvent(view_model.bannerListTouchMoveEvent);
      },
      addBannerListTouchEndEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addBannerListTouchEndEvent(view_model.bannerListTouchEndEvent);
      },
      addBannerListMouseDownEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addBannerListMouseDownEvent(view_model.bannerListMouseDownEvent);
      },
      addDocumentMouseUpEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addDocumentMouseUpEvent(view_model.documentMouseUpEvent);
      },
      addDocumentMouseMoveEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.addDocumentMouseMoveEvent(view_model.documentMouseMoveEvent);
      },
      removeBannerListTouchMoveEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeBannerListTouchMoveEvent(view_model.bannerListTouchMoveEvent);
      },
      removeBannerListTouchStartEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeBannerListTouchStartEvent(view_model.bannerListTouchStartEvent);
      },
      removeBannerListTouchEndEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeBannerListTouchEndEvent(view_model.bannerListTouchEndEvent);
      },
      removeBannerListMouseDownEvenet : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeBannerListMouseDownEvenet(view_model.bannerListMouseDownEvent);
      },
      removeDocumentMouseMoveEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeDocumentMouseMoveEvent(view_model.documentMouseMoveEvent);
      },
      removeDocumentMouseUpEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeDocumentMouseUpEvent(view_model.documentMouseUpEvent);
      },
      removeBannerListScrollEvent : function(){
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL;
        view_model.removeBannerListScrollEvent(view_model.bannerListScrollEvent);
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
      // Функция добавления события позиционирования по левому краю на скролл
      addWindowScrollLeftEvent : function(){
        // объявляем модель отрисовки и модель конфигураций
        var view_model = PRESSTAKE_BANNER_CORE.MODELS.VIEW_MODEL,
            config_model = PRESSTAKE_BANNER_CORE.MODELS.CONFIG_MODEL;
        // вызываем функцию из модели отрисовки для добавления события при скроле. В качестве события передаём функцию из модели конфигураций по расчёту левого отступа
        view_model.addWindowScrollEvent(config_model.getBannerLeft);
        // вызываем функцию из модели отрисовки для добавления события при скроле. В качестве события передаём функцию добавления левого отступа к банеру.
        view_model.addWindowScrollEvent(view_model.scrollLeftEvent);
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
        // запись ориентации устройства
        view_model.addWindowZoomEvent(config_model.getDeviceOrientation);
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
        // удаление ориентации устройства
        view_model.removeWindowZoomEvent(config_model.getDeviceOrientation);
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
        // Если отслеживание ошибок включено то
        if (config.debag == true) {
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если идентификатор интервала существует
        if (intervalId) {
          // Очистим интервал
          clearInterval(intervalId);
          // Иначе если листинг для записи ошибок объявлен то  
        } else if (debagList){
          // Запишем ошибку
          debagList.push("2");
        }
        // Если объявлен ответ с сервера
        if (response) {
          // Если объявлен в ответе сервера идентификатор страницы то
          if (response.page) {
            // Запишем конфигурации с сервера
            config.pageID = response.page;
            // Иначе если объявлен листинг для записи ошибок то
          } else if (debagList){
            // Запишем ошибку
            debagList.push("3");
          }
          // Если объявлен идентификатор баннера в ответе сервера то
          if (response.banId) {
            // запишем конфигурации с сервера
            config.ovid = response.banId;
            // иначе если объявлен листинг для записи ошибок то    
          } else if (debagList){
            // Запишем ошибку
            debagList.push("4");
          }
        // Если ответ сервера не объявлен и объявлен листинг для записи ошибок то
        } else if (debagList) {
          // Запишем ошибку
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
        // Если отслеживание ошибок включено то
        if (config.debag == true) {
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если объявлен идентификатор интервала то
        if (intervalId) {
          // Очистим интервал
          clearInterval(intervalId);  
          // иначе если объявлен листинг для записи ошибок то
        } else if (debagList){
          // Запишем ошибку
          debagList.push("5");
        }
        // Если объявлен ответ сервера то
        if (response){
          // Если существует листинг офферов в ответе сервера то
          if (response.data){
            // объявим цикл до количества ячеек в массиве листинга офферов ответа сервера, также для каждой ячейки объявим объект и порядковый номер элемента
            response.data.map(function(item, itemKey){
              // Если объявлен листинг для записи ошибок то
              if (debagList) {
                // Если не существует в конфигурациях идентификатор клиента то
                if (!config.clientID) {
                  // Запишем ошибку
                  debagList.push("8");
                }
                // Если не существует в конфигурациях идентификатор баннера то
                if (!config.bannerID) {
                  // Запишем ошибку
                  debagList.push("9");
                }
                // Если не сущестувует в конфигурациях идентификатор страницы то
                if (!config.pageID) {
                  // Запишем ошибку
                  debagList.push("10");
                }
                // Если в ответе сервера на текущем оффере не существует параметр идентификатор предмета то
                if (!item.sitid) {
                  // Запишем ошибку
                  debagList.push("11("+itemKey+")");
                }
                // Если не сущестувует в конфигурациях идентификатор то
                if (!config.ovid) {
                  // Запишем ошибку
                  debagList.push("12");
                }
                // Если не существует список путей в конфигурациях то 
                if (!config.URL) {
                  // Запишем ошибку
                  debagList.push("13");
                }
              }
              // Запишем в информацию оффера ссылку на него
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
          // Если нет списка офферов в ответе сервера и если объявлен листинг для записи ошибок то
          } else if (debagList) {
            // Запишем ошибку
            debagList.push("7");
          }
        // Если нет ответа сервера и объявлен листинг для записи ошибок то  
        } else if (debagList){
          // Запишем ошибку
          debagList.push("6");
        }
        // Запишем ответ сервера в конфигурации
        config.appList = response;
        // Запустим инициализацию DOM узлов
        PRESSTAKE_BANNER_CORE.CONTROLLERS.INIT_CONTROLLER.init_content();
      },
      // Положительный метод на отправку статистики
      // Функция принимает ответ сервера и идентификатор интервала
      statBannerSuccess : function(response, intervalId){
        // Объявляем конфигурации, переключатель записи ошибок
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            debag = config.debag;
        // Если переключатель положительный то
        if (debag == true) {
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если объявлен идентификатор интервала то
        if (intervalId) {
          // Очистим интервал
          clearInterval(intervalId);
        // Если не объявлен идентификатор интервала и объявлен листинг для записи ошибок то
        } else if (debagList) {
          // Запишем ошибку
          debagList.push("14");
        }
        // Если не объявлен ответ сервера и объявлен листинг для записи ошибок то
        if (!response && debagList) {
          // Запишем ошибку
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
        // Если переключатель дял записи ошибок положителен то
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях объявлен список путей то
        if (config.URL){
          // Если в списке путей нет пути корня и объявлен листинг для записи ошибок то
          if (!config.URL.TARGET_URL && debagList){
            // Запишем ошибку
            debagList.push("17");
          }
          // Если в списке путей нет пути до стилей и объявлен листинг для записи ошибок то
          if (!config.URL.CSS_URL && debagList){
            // Запишем ошибку
            debagList.push("18");
          }
        // Если нет путей и объявлен листинг для записи ошибок то 
        } else if (debagList){
          // Запишем ошибку
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
        // Если переключатель для записи ошибок положителен то
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("19");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("20");
        }
        // Если в конфигурациях нет локации и объявлен листинг для записи ошибок то
        if (!config.location && debagList){
          // Запишем ошибку
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
          // объявлием конфигурации по умолчанию
          var config = PRESSTAKE_BANNER_CORE.CONFIG;
        }
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("22");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("23");
        }
        // Если в конфигурациях нет идентификатора страницы и объявлен листинг для записи ошибок то
        if (!config.pageID && debagList){
          // Запишем ошибку
          debagList.push("24");
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
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
        // Если отслеживание ошибок включено то
        if (config.debag == true) {
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("26");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("27");
        }
        // Если в конфигурациях нет идентификатора страницы и объявлен листинг для записи ошибок то
        if (!config.pageID && debagList){
          // Запишем ошибку
          debagList.push("28");
        }    
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
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
        // Если переключатель записи листинга ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("30");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("31");
        }
        // Если в конфигурациях нет идентификатора страницы и объявлен листинг для записи ошибок то
        if (!config.pageID && debagList){
          // Запишем ошибку
          debagList.push("32");
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("34");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("35");
        }
        // Если в конфигурациях нет идентификатора страницы и объявлен листинг для записи ошибок то
        if (!config.pageID && debagList){
          // Запишем ошибку
          debagList.push("36");
        }
        // Если в конфигурациъ нет идентификатора предмета магазина и объявлен листинг для записи ошибок то
        if (!config.sitID && debagList){
          // Запишем ошибку
          debagList.push("37");
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("39");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("40");
        }
        // Если в конфигурациях нет локации и объявлен листинг для записи ошибок то
        if (!config.location && debagList){
          // Запишем ошибку
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
        // Если отслеживание ошибок включено то
        if (config.debag == true) {
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора клиента и объявлен листинг для записи ошибок то
        if (!config.clientID && debagList){
          // Запишем ошибку
          debagList.push("42");
        }
        // Если в конфигурациях нет идентификатора баннера и объявлен листинг ошибок то
        if (!config.bannerID && debagList){
          // Запишем ошибку
          debagList.push("43");
        }
        // Если в конфигурациях нет идентификатора страницы и объявлен листинг для записи ошибок то
        if (!config.pageID && debagList){
          // Запишем ошибку
          debagList.push("44");
        }
        // Если в конфигурациях нет операционной системы клиента и объявлен листинг для записи ошибок то
        if (!config.clientOS && debagList){
          // Запишем ошибку
          debagList.push("45");
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ID && debagList){
          // Запишем ошибку
          debagList.push("47");
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
          debagList.push("48");
        }
        // Если в конфигурацих нет адресса нового пользователя и объявлен листинг для записи ошибок то
        if (!config.email && debagList){
          // Запишем ошибку
          debagList.push("49");
        }
        // Если в конфигурациях нет операционной системы клиента и объявлен листинг для записи ошибок то
        if (!config.clientOS && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ID && debagList){
          // Запишем ошибку
          debagList.push("51");
        }
        // Если в конфигурациях нет идентификатора и объявлен листинг для записи ошибок то
        if (!config.ovid && debagList){
          // Запишем ошибку
          debagList.push("52");
        }
        // Если в конфигурацих нет адресса нового пользователя и объявлен листинг для записи ошибок то
        if (!config.email && debagList){
          // Запишем ошибку
          debagList.push("53");
        }
        // Если в конфигурациях нет операционной системы клиента и объявлен листинг для записи ошибок то
        if (!config.clientOS && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не объявлен ответ сервера и объявлен листинг для записи ошибок то
        if (!request && debagList) {
          // Запишем ошибку
          debagList.push("55");
        }
        // Если не объявлен путь и объявлен листинг для записи ошибок то
        if (!url && debagList) {
          // Запишем ошибку
          debagList.push("57");
        }
        // Если не объявлена функция на положительный ответ сервера и объявлен листинг для записи ошибок то
        if (!callback && debagList){
          // Запишем ошибку
          debagList.push("58");
        }
        // Если не объявлена функция на отрицательный ответ сервера и объявлен листинг для записи ошибок то 
        if (!callbackError && debagList){
          // Запишем ошибку
          debagList.push("59");
        }
        // Если не объявлен идентификатор индервала и объявлен листинг для записи ошибок то
        if (!intervalId && debagList){
          // Запишем ошибку
          debagList.push("60");
        }
        // Вызод метода для установки соединения по переданному пути
        request.open('GET', url, true);
        // События которые должны вызываться во время соединения
        request.onreadystatechange = function(){
          // Если стадия отправки запроса не равна 4 то прекращаем работу функции
          if (request.readyState != 4) { return false; }
          // Если статус сервера успешен и существует успешный метод то
          if (request.status == 200 && callback) {
            // Преобразуем в JSON ответ сервера
            var response = JSON.parse(request.responseText);
            // Если ответ сервера не удачен и если объявлен листинг для записи ошибок то
            if (!response && debagList) {
              // Запишем ошибку
              debagList.push("56");
            }
            // Проверяем есть ли в ответе сервера свойство статуса
            if (response.hasOwnProperty("status") || response.hasOwnProperty("requestStatus")) {
              // Если нет свойства статуса то
              if (!response.hasOwnProperty("status")){
                // проеверяем другое название свойства
                response.status = response.requestStatus;
              }
              // Если есть то проверяем положительно ли оно
              if (response.status == config.status.STATUS_OK || response.status == config.status.STATUS_OK_2 || response.status == config.status.STATUS_OK_3) {
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
        // Объявляем переключатель записи ошибок равным переданым конфигурациям или конфигурациям по умолчанию
        var debag = config.debag || PRESSTAKE_BANNER_CORE.CONFIG.debag;
        // если переключатель положительный то
        if (debag == true){
          // объявляем листинг для записи ошибок из переданых конфигураций или из стандартных
          var debagList = config.debagList || PRESSTAKE_BANNER_CORE.CONFIG.debagList;
        }
        // Если нет функции ассихронной связи и если объявлен листинг для записи ошибок то
        if (!ajax_function && debagList){
          // Запишем ошибку
          debagList.push("61");
        }
        // Если не объявлена функция на положительный ответ сервера и объявлен листинг для записи ошибок то
        if (!callback && debagList){
          // Запишем ошибку
          debagList.push("62");
        }
        // Если не объявлена функция на отрицательный ответ сервера и объявлен листинг для записи ошибок то 
        if (!callbackError && debagList){
          // Запишем ошибку
          debagList.push("63");
        }
        // Если не объявлен путь до сервера и объявлен листинг для записи ошибок то
        if (!url && debagList){
          // Запишем ошибку
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
          // Если нет в конфигурациях ограничителя повторейний запросов и объявлен листинг записи ошибок то
          if (!config.repeatCounter && debagList) {
            // Запишем ошибку
            debagList.push("65("+intervalId+", "+this.tick+")");
          }
          // Если не объявлен путь и объявлен листинг для записи ошибок то
          if (!url && debagList) {
            // Запишем ошибку
            debagList.push("66("+intervalId+", "+this.tick+")");
          }
          // Если не объявлена функция на положительный ответ сервера и объявлен листинг для записи ошибок то
          if (!callback && debagList) {
            // Запишем ошибку
            debagList.push("67("+intervalId+", "+this.tick+")");
          }
          // Если не объявлена функция на отрицательный ответ сервера и объявлен листинг для записи ошибок то
          if (!callbackError && debagList) {
            // Запишем ошибку
            debagList.push("68("+intervalId+", "+this.tick+")");
          }
          // Если нет ограничителя времени повтора запроса в конфигурациях и объявлен листинг для записи обшибок то
          if (!config.repeatTimeout && debagList){
            // Запишем ошибку
            debagList.push("69("+intervalId+", "+this.tick+")"); 
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
        // Если отслеживание ошибок включено то
        if (config.debag == true) {
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        if (!protocol && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не объявлен вывод данных о клиенте и объявлен листинг для записи ошибок то
        if (!userAgent && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не объявлен идентификатор загрузчика и объявлен листинг для записи ошибок то 
        if (!config.loaderID && debagList) {
          // Запишем ошибку
          debagList.push("72");
        }
        // Записываем переменную - дискриптор на HTML узер загрузчика по идентификатору из конфигураций
        var loaderDOM = document.getElementById(config.loaderID);
        // Если не объявлен HTML узел загрузчика и объявлен листинг для записи ошибок то
        if(!loaderDOM && debagList) {
          // Запишем ошибку
          debagList.push("73");
        }
        // Если в HTML узле загрузчика нет атребута с идентификатором банера и объявлен листинг для записи ошибок то
        if (!loaderDOM.getAttribute("data-bid") && debagList){
          // Запишем ошибку
          debagList.push("74");
        }
        // Если в HTML узле загрузчика нет аттребута с идентификатором клиента и объявлен листинг для записи ошибок то
        if (!loaderDOM.getAttribute("data-clid") && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не объявлен вертикальный скролл окна и объявлен листинг для записи ошибок то
        if (windowScrollTop == undefined && debagList){
          // Запишем ошибку
          debagList.push("76");
        }
        // Если не объявлена высота клиентской части отображения и объявлен листинг для записи ошибок то
        if (clientHeight == undefined && debagList){
          // Запишем ошибку
          debagList.push("77");
        }
        // Если не объявлена высота вертикального скролла и объявлен листинг для записи ошибок то
        if (scrollHeight == undefined && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не объявлена ширина окна и объявлен листинг для записи ошибок то
        if (width == undefined && debagList){
          // Запишем ошибку
          debagList.push("79");
        }
        if (config.deviceOrientation == "landscape"){
          config.zoom = (width / 3) / 700;
        } else {
          // Записываем зум для баннера в конфигурации
          config.zoom = width / 700;
        }
      },
      // Функция для получения левого отступа баннера
      getBannerLeft : function(){
        // Объявляем конфигурации, ширину html окумента, горизонтальный скрол окна
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            clientWidth = document.documentElement.clientWidth,
            scrollLeft = window.scrollX;
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если ширина основного документа не объявлена и объявлен листинг для записи ошибок то
        if (clientWidth == undefined && debagList){
          // Запишем ошибку
          debagList.push("80");
        }
        // Если горизонтальный скролл окна не объявлен и объявлен листинг для записи ошибок то
        if (scrollLeft == undefined && debagList){
          // Запишем ошибку
          debagList.push("81");
        }
        if (config.clientOS != "ios"){
          // Записываем процент отступа от левого края для баннера
          config.bannerLeft = (scrollLeft * 100) / clientWidth;
        } else {
          config.bannerLeft = 0;
        }
      },
      // Функция для получения отступа от нижнего края псевдо видимого экрана клиента
      getBannerBottom : function(){
        // Объявляем конфигурации, высоту тела html документа, вертикальный скролл окна
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            clientHeight = document.body.clientHeight,
            scrollTop = window.scrollY;
        //console.log((scrollTop * 100) / clientHeight);
        // Записываем процентный отступ от нижнего края псевдо видимой области экрана клиента для баннера
        config.bannerBottom = 0;
      },
      // Функция для получения ориентации устройства
      getDeviceOrientation : function(){
        // Объявляем конфигурации , ширину окна, высоту окна
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            width = window.innerWidth,
            height = window.innerHeight;
        // если соотношение высоты и ширины больше 1 то
        if ((height / width) > 1){
          // запишем в конфигурации что ориентация горизонтальная
          config.deviceOrientation = "portrait";
        // Иначе
        } else {
          // запишем в конфигурации что ориентация вертикальная
          config.deviceOrientation = "landscape";
        }
      },
      // Функция для получения типа устройства
      getDeviceType : function(){
        // Объявляем конфигурации, агент пользователя в нижнем регистре, функцию для поиска в агенте и объяект устройства
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            userAgent = window.navigator.userAgent.toLowerCase(),
            // функция принимает строку для поиска в агенте пользователя
            find = function (needle) {
              // возвращает результат сравнения позиции найденного текста, если позиция не равна -1 то возваращает положительный результат, иначе отрицательный
              return userAgent.indexOf(needle) !== -1;
            },
            device = {
              // функция для определения операционной системы fx
              fxos : function () {
                // возвращает первый положительный резульат поисковых запросов в агенте или отрецательный 
                return (find('(mobile;') || find('(tablet;')) && find('; rv:');
              },
              // функция для определения операционной системы blackberry
              blackberry : function () {
                // возвращает положительный результат если среди запросов есть положительный ответ или отрицательный если все отрицательные
                return find('blackberry') || find('bb10') || find('rim');
              },
              // функция для определения операционной системы windows
              windows : function () {
                // возвращает результат выполнения поиска
                return find('windows');
              },
              // функция для определения операционной системы android
              android : function () {
                // возвращает положительный результат если операционная система не windows и найден резульат поиска
                return !device.windows() && find('android');
              },
              // функция для определения типа планшет под операционной системой fx
              fxosTablet : function () {
                // функция возвращает положительный результат если результаты запросов положительные или отрицательный если все ложные
                return device.fxos() && find('tablet');
              },
              // функция для определения типа планшет пот операционной системой windows
              windowsTablet : function () {
                // возвращает положительный результат если положительные результаты поисковых запросов или отрецательный если ложные
                return device.windows() && (find('touch') && !device.windowsPhone());
              },
              // функция для определения типа планшет под управлением операционной системы blackberry
              blackberryTablet : function () {
                // возвращает положительный результат если оба условия положительны или отрицательный если ложный хоть один
                return device.blackberry() && find('tablet');
              },
              // функция для определения типа планшет под операционной системой android
              androidTablet : function () {
                // возвращает положительный результат если операционная система android и запрос положительный
                return device.android() && !find('mobile');
              },
              // функция для определения устройства ipad
              ipad : function () {
                // возвращает положительный результат если запрос положительный или отрицалельный если ложный
                return find('ipad');
              },
              // функция для определения meego
              meego : function () {
                // возвращает отрицательный результат если запрос ложный и положительный если запрос достоверный
                return find('meego');
              },
              // функция для определения телефона с операционной системой fx
              fxosPhone : function () {
                // возваращает положительный результат если операционная система fx и тип мобильник
                return device.fxos() && find('mobile');
              },
              // функция для определения телефона с операционной системой blackberry
              blackberryPhone : function () {
                // возваращает положительный результат если операционная система blackberry и тип не планшет
                return device.blackberry() && !find('tablet');
              },
              // функция для определения телефона с операционной системой windows
              windowsPhone : function () {
                // возвращает положительный результат если операционная система windows и тип телефон
                return device.windows() && find('phone');
              },
              // функция для определения устройства ipod
              ipod : function () {
                // возваращает положительный результат если находит ipod
                return find('ipod');
              },
              // функция для определения устройства iphone
              iphone : function () {
                // возвращает положительный результат если операционная система не windows и если нашёл iphone
                return !device.windows() && find('iphone');
              },
              // функция для определения телефона с операционной системой android
              androidPhone : function () {
                // возвращает положительный результат если опрационная система android и тип мобильник
                return device.android() && find('mobile');
              },
              // функция для определения мобильный устройств
              mobile : function () {
                // возвращает положительный результат если телефон с android
                return device.androidPhone() ||
                       // или это iphone
                       device.iphone() ||
                       // или это ipod
                       device.ipod() ||
                       // или это телефон с windows 
                       device.windowsPhone() || 
                       // или это телефон с blackberry
                       device.blackberryPhone() || 
                       // или это телефон с fx
                       device.fxosPhone() || 
                       // или если это meego
                       device.meego();
              },
              // функция для определения планшета
              tablet : function () {
                // возвращает положительный результат если это ipad
                return device.ipad() || 
                       // или планшет с android
                       device.androidTablet() || 
                       // или планшет с blackberry
                       device.blackberryTablet() || 
                       // или планшет с windows
                       device.windowsTablet() || 
                       // или планшет с fx
                       device.fxosTablet();
              },
              // функция для определения персонального компьютера
              desktop : function () {
                // возваращает положительный результат если это не планшет и не телефон
                return !device.tablet() && !device.mobile();
              }
            };
        // если переключатель записи в листинг ошибок положительный то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не удалось определить агент пользователя и объявлен листинг для записи ошибок то
        if (!userAgent && debagList){
          // записываем ошибку
          debagList.push("129");
        }
        // если устройство не персональный компьютер то
        if (!device.desktop()){
          // если устройство не планшет то
          if (!device.tablet()){
            // если устройство не телефон то
            if (!device.mobile()){
              // записываем в конфигурацию категорию остольные
              config.device = "other";
            // если устройство телефон то
            } else {
              // записываем в конфигурации категорию телефон
              config.device = "mobile";
            }
          // если устройство планшет то
          } else {
            // записываем в конфигурации категорию планшет
            config.device = "tablet";
          }
        // если устройство персональный компьютер то
        } else {
          // записываем в конфигурации категорию персональный компьютер компьютер
          config.device = "desktop";
        }
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
        // Если переключатель записи ошибок положительный то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
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
            banner_main_link = document.createElement("div"),
            // создаём html узел для цветного текста в нижнем тексте главной области
            banner_main_text_bottom_colored = document.createElement("a");

        // Если нет ответа сервера и объявлен листинг для записи ошибок то
        if (!response && debagList){
          // Запишем ошибку
          debagList.push("82");
        }

        // добавляем класс к контейнеру баннера
        banner.classList.add("pt-banner");
        // добавляеам идентификатор для контейнера баннера
        banner.id = config.bannerSpaceID;

        // Если нет идентификатора баннера и объявлен листинг для записи ошибок то
        if (config.bannerSpaceID == undefined && debagList){
          // Запишем ошибку
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
        banner_list_scroll.id = "pt-banner-scroll";
        // Добавляем класс для контейнера офферов
        banner_list_scroll_list.classList.add("pt-banner-list");

        // Если нет классов в конфигурации и объявлен листинг для записи ошибок то
        if (!config.bannerClasses && debagList){
          // Запишем ошибку
          debagList.push("84");
        }
        // Если в ответе сервера нет типа баннера то
        if (response.templateType == undefined){
          // Сделаем тип по умолчанию 0
          response.templateType = 0;
        }
        // Если нет в ответе сервера типа отображения баннера и объявлен листинг для записи ошибок то
        if(response.templateType == undefined && debagList){
          // Запишем ошибку
          debagList.push("85");
        }

        // Добавляем класс для контейнера баннера из конфигураций
        banner.classList.add(config.bannerClasses[response.templateType]);

        // добавляем текстовый узел для верхнего текста главной области баннера
        banner_main_text_top.innerHTML = "Лучшие цены в он-лайн магазинах";
        // добавляем текстовый узел для вернего текста при открытии листинга офферов для главной области баннера
        banner_main_text_top_open.innerHTML = "Посмотреть больше предложений";
        
        // Если тип отображения банера из запроса стандартный, либо гаджеты, либо одежда то
        if (response.templateType == 0 || response.templateType == 5 || response.templateType == 2){
          // добавляем текстовый узел для среднего текста главной области баннера
          banner_main_text_middle.innerHTML = "Где купить товары из этой статьи?";
        // Если тип отображения баннера из запроса книги то
        } else if (response.templateType == 1){
          // добавляем текстовый узел для среднего текста главной области баннера
          banner_main_text_middle.innerHTML = "Где купить или скачать книгу из этой статьи?";
        // Если тип отображения баннера из запроса фильмы то
        } else if (response.templateType == 3){
          // добавляем текстовый узел для среднего текста главной области баннера
          banner_main_text_middle.innerHTML = "Где посмотреть фильм из этой статьи?";
        // Если тип отображения баннера из запроса игры то
        } else if (response.templateType == 4){
          // добавляем текстовый узел для среднего текста главной области баннера
          banner_main_text_middle.innerHTML = "Где скачать приложение из этой статьи?";
        }

        
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

        // Если нет листинга офферов в ответе сервера и объявлен листинг для записи ошибок то
        if (!response.data && debagList){
          // Запишем ошибку
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

          // Если нет сгенерированной ссылки на оффер и объявлен листинг для записи ошибок то
          if (!item.link && debagList) {
            // Запишем ошибку
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

          // Если нет таргетирования по системе магазина оффера и объявлен листинг для записи ошибок то
          if (!item.itarget && debagList){
            // Запишем ошибку
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

          // Если нет картинки оффера и объявлен листинг для записи ошибок то
          if (!item.image && debagList){
            // Запишем ошибку
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

          // Если нет текстового названия для ссылки на оффер и объявлен листинг для записи ошибок то
          if (!item.linkName && debagList){
            // Запишем ошибку
            debagList.push("90("+itemKey+")");
          }
          if (item.hasOwnProperty("linkName")){
            // Добавляем текстовый узел в ссылку
            banner_list_scroll_list_item_link.innerHTML = item.linkName;  
          }
          
          // Если нет имени оффера и объявлен листинг для записи ошибок то
          if (!item.name && debagList){
            // Запишем ошибку
            debagList.push("91("+itemKey+")");
          }
          
          // добавляем текстовый узел для заголовка оффера
          banner_list_scroll_list_item_title.innerHTML = item.name;
          
          // Если нет цены оффера и объявлен листинг для записи ошибок то
          if (item.price == undefined && debagList){
            // Запишем ошибку
            debagList.push("92("+itemKey+")");
          }

          // добавляем текстовый узел для цены оффера
          banner_list_scroll_list_item_price.innerHTML = item.price;
          // добавляем url атрребут для ссылки - кнопки на оффер
          banner_list_scroll_list_item_button.href = item.link;

          // Добавляем в контейнер картинки картинку оффера
          banner_list_scroll_list_item_image.appendChild(banner_list_scroll_list_item_image_img);

          // Если нет альтернативных текстов для оффера и объявлен листинг для записи ошибок то
          if (!item.hasOwnProperty("alternativeText") && debagList){
            // Запишем ошибку
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

            // Если нет верхнего альтернативного текста оффера и объявлен листинг для записи ошибок то
            if (item.alternativeText.top == undefined && debagList){
              // Запишем ошибку
              debagList.push("94("+itemKey+")");
            }
            // Если нет нижнего альтернативного текста оффера и объявлен листинг для записи ошибок то
            if (item.alternativeText.bottom == undefined && debagList){
              // Запишем ошибку
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

          // Если нет краткого описания оффера и объявлен листинг для записи ошибок то
          if (!item.hasOwnProperty("description") && debagList){
            // Запишем ошибку
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
              banner_list_header_source_after = document.createElement("a"),
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

          // Если нет названия ресурса и объявлен листинг для записи ошибок то
          if (!response.shipperName && debagList){
            // Запишем ошибку
            debagList.push("97");
          }
          if (!response.hasOwnProperty("shipperName")){
            response.shipperName = "Яндекс.Маркет";
          }
          // добавление текстового узла для ресурса
          banner_list_header_source_after.innerHTML = response.shipperName;
          // добавление ссылки на яндекс маркет
          banner_list_header_source_after.href = "https://market.yandex.ru";

          // объявляем html узел для опции селектора по умолчанию
          var banner_list_header_selector_selector_option = document.createElement("option");
          // Добовляем класс для опции селектора
          banner_list_header_selector_selector_option.classList.add("pt-banner-list-header-selector-option");
          // Добавляем атребут для отображения по умолчанию
          banner_list_header_selector_selector_option.setAttribute("selected", "");

          // Если нет гео позиции по умолчанию и объявлен листинг для записи ошибок то
          if (!response.hasOwnProperty("geo") && debagList){
            // Запишем ошибку
            debagList.push("98");
          }
          if (!response.hasOwnProperty("geo")){
            response.geo = {
              name : "Москва"
            };
          }

          // Добавляем название города
          banner_list_header_selector_selector_option.innerHTML = response.geo.name;
          // Добавляем опцию в селект
          banner_list_header_selector_selector.appendChild(banner_list_header_selector_selector_option);

          // Если нет списка городов и объявлен листинг для записи ошибок то
          if (!response.hasOwnProperty("cities") && debagList){
            // Запишем ошибку
            debagList.push("99");
          }

          // Если есть список городов в ответе сервера то
          if(response.hasOwnProperty("cities")){
            // Объявляем цыкл до количества городов в ответе сервера
            response.cities.map(function(city, cityKey){
              // объявляем html узел для опции селектора
              var banner_list_header_selector_selector_option = document.createElement("option");

              // Если нет у города идентификатора и объявлен листинг для записи ошибок то
              if (city.id == undefined && debagList){
                // Запишем ошибку
                debagList.push("100("+cityKey+")");
              }
              // Если нет у города имени и объявлен листинг для записи ошибок то
              if (!city.name && debagList){
                // Запишем ошибку
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

        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Добавляем свойство указания на стилевой файл к тегу стилей
        css.rel = "stylesheet";
        // Добавляет свойство для обозначения пути до стилевого файла и приравниваем путь полученый при вызове
        if (!url && debagList){
          // Запишем ошибку
          debagList.push("102");
        }
        // запишем ссылку для загрузки стилей
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет идентификатора html узла баннера в конфигурациях и объявлен листинг для записи ошибок то
        if (!config.bannerSpaceID && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет идентификатора html узла баннера в конфигурациях и объявлен листинг для записи ошибок то
        if (!config.bannerSpaceID && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет идентификатора html узла баннера в конфигурациях и объявлен листинг для записи ошибок то
        if (!config.bannerSpaceID && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет идентификатора html узла баннера в конфигурациях и объявлен листинг для записи ошибок то
        if (!config.bannerSpaceID && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет параметра прокрутки в конфигурациях и объявлен листинг для записи ошибок то
        if (config.scroll == undefined && debagList){
          // Запишем ошибку
          debagList.push("107");
        }
        // Если в конфигурациях нет операционной системы клиента и объявлен листинг для записи ошибок то
        if (!config.clientOS && debagList){
          // Запишем ошибку
          debagList.push("108");
        }
        // если скролл страницы больше 20 процентов и устройство не персональный компьютер
        if (config.scroll > 20) {
          // Вызываем функцию открытия баннера
          PRESSTAKE_BANNER_CORE.CONTROLLERS.VIEW_CONTROLLER.showBanner();
        }
      },
      // Функция которая срабытывает при скроллле страницы
      scrollLeftEvent : function() {
        // объявляем конфигурации и html узел баннера
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            banner = document.getElementById(config.bannerSpaceID);
        // Если переключатель записи ошибок положительный то
        if (config.debag == true){
          // Объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если не объявлен отступ от левого края баннера в конфигурациях и объявлен листинг записи ошибок то
        if (config.bannerLeft == undefined && debagList){
          // Записываем ошибку
          debagList.push("127");
        }
        // Если не удалось получить HTML узел баннера и объявлен листинг записи ошибок то
        if (!banner && debagList){
          // Записываем ошибку
          debagList.push("128");
        }
        if (window.innerWidth < 700) {
          // Добавлем в стили позиционирование по левому краю из конфигураций + %
          banner.style.left = config.bannerLeft + "%";
        }
      },
      // Функция которая срабатывает при зумировании страницы
      // Функция принимает конфигурации
      zoomEvent : function (config){
        // Объявляются конфигурации и html узел баннера
        var config = PRESSTAKE_BANNER_CORE.CONFIG,
            banner = document.getElementById(config.bannerSpaceID),
            windowWidth = window.innerWidth;
        // Если переключатель записи листинга ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет параметра увеличения в конфигурациях и объявлен листинг для записи ошибок то
        if (config.zoom == undefined && debagList){
          // Запишем ошибку
          debagList.push("109");
        }
        // Если нет параметра отступа от левого края в конфигурацих и объявлен листинг для записи ошибок то
        if (config.bannerLeft == undefined && debagList){
          // Запишем ошибку
          debagList.push("110");
        }
        // Если нет параметра отступа от нижнего края в конфигурациях и объявлен листинг для записи ошибок то
        if (config.bannerBottom == undefined && debagList){
          // Запишем ошибку
          debagList.push("111");
        }
        //banner.style.zoom = config.zoom;
        banner.style.left = config.bannerLeft + "%";
        banner.style.transform = "scale("+config.zoom+")";
        banner.style.webkitTransform = "scale("+config.zoom+")";
        banner.style.mozTransform = "scale("+config.zoom+")";
        banner.style.msTransform = "scale("+config.zoom+")";
        banner.style.oTransform = "scale("+config.zoom+")";
      },
      // Функция для открытия листинга офферов при клике на главную область баннера
      // Функция принимает событие
      bannerMainClickFirstEvent : function (event) {
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Корректировка события если необходимо
        event = event || window.event;
        // Если нет события и объявлен листинг для записи ошибок то
        if (!event && debagList){
          // Запишем ошибку
          debagList.push("112");
        }
        // Объявление DOM объекта события
        var target = event.target || event.srcElement;
        // Если нет элемента таргетирования и объявлен листинг для записи ошибок то
        if (!target && debagList){
          // Запишем ошибку
          debagList.push("113");
        }
        // Если у элемента тагретирования нет идентификатора и объявлен листинг для записи ошибок то
        if (!target.id && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положительный то 
        if(config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Корректировака события если нужно
        event = event || window.event;
        // Объявление DOM бъекта события
        var target = event.target || event.srcElement;
        // Если нет элемента таргетирования и объявлен листинг для записи ошибок то
        if (!target && debagList){
          // Запишем ошибку
          debagList.push("115");
        }
        // Если у ээлемента таргетирования нет идентификатора и объявлен листинг для записи ошибок то
        if (!target.id && debagList){
          // Запишем ошибку
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
      bannerListScrollEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll");
        dom.scrollLeft += event.deltaY;
      },
      bannerListTouchStartEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll");
        if (!dom.hasOwnProperty("scrollProp")){
          dom.scrollProp = {
            x : event.targetTouches[0].clientX
          };
        } else {
          dom.scrollProp.x = event.targetTouches[0].clientX;
          if (dom.scrollProp.hasOwnProperty("intervalId")){
            if (dom.scrollProp.intervalId){
              clearInterval(dom.scrollProp.intervalId);
            }
          }
        }
      },
      bannerListTouchMoveEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll"),
            scroll = event.targetTouches[0].clientX - dom.scrollProp.x;
        scroll = -1 * scroll;
        if (Math.abs(scroll) < 5) {
          if (scroll < 0){
            scroll = -10;
          } else {
            scroll = 10;
          }
        }
        dom.scrollProp.dx = scroll;
        dom.scrollLeft += scroll;
        dom.scrollProp.x = event.targetTouches[0].clientX;
        event.preventDefault ? event.preventDefault() : (event.returnValue=false);
      },
      bannerListTouchEndEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll");
        if (dom.hasOwnProperty("scrollProp")){
          if (Math.abs(dom.scrollProp.dx) < 7 || Math.abs(dom.scrollProp.dx) == 10){
            dom.scrollProp.dx = 0;
          }
          dom.scrollProp.intervalId = setInterval(function(){
            if (!this.hasOwnProperty("tick")){
              this.tick = 0;
            }
            if (this.tick >= 200){
              clearInterval(dom.scrollProp.intervalId);
            } else {
              var scroll = ((dom.scrollProp.dx * 50) / 200);
              dom.scrollLeft += Math.ceil(scroll);
              this.tick++;   
            }
          }.bind(new Object),1);
        }
      },
      bannerListMouseDownEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll");
        if (!dom.hasOwnProperty("scrollProp")){
          dom.scrollProp = {
            x : event.clientX,
            mousedown : true
          };
        } else {
          dom.scrollProp.x = event.clientX;
          dom.scrollProp.mousedown = true;
          if (dom.scrollProp.hasOwnProperty("intervalId")){
            if (dom.scrollProp.intervalId){
              clearInterval(dom.scrollProp.intervalId);
            }
          }
        }
        event.preventDefault ? event.preventDefault() : (event.returnValue=false);
      },
      documentMouseMoveEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll");
        if (dom.hasOwnProperty("scrollProp")){
          if (dom.scrollProp.hasOwnProperty("mousedown")){
            if (dom.scrollProp.mousedown){
              var scroll = event.clientX - dom.scrollProp.x;
              if (Math.abs(scroll) > 0){
                scroll = -1 * scroll * 2;
                if (Math.abs(scroll) < 5) {
                  if (Math.sign(scroll) < 0){
                    scroll = -10;
                  } else {
                    scroll = 10;
                  }
                }
              }
              dom.scrollProp.dx = scroll;
              dom.scrollLeft += scroll;
              dom.scrollProp.x = event.clientX;   
            }
          }
        }
        event.preventDefault ? event.preventDefault() : (event.returnValue=false);
      },
      documentMouseUpEvent : function(event){
        event = event || window.event;
        var dom = document.getElementById("pt-banner-scroll");
        if (dom.hasOwnProperty("scrollProp")){
          dom.scrollProp.mousedown = false;
          if (Math.abs(dom.scrollProp.dx) < 5){
            dom.scrollProp.dx = 0;
          }
          dom.scrollProp.intervalId = setInterval(function(){
            if (!this.hasOwnProperty("tick")){
              this.tick = 0;
            }
            if (this.tick >= 200){
              clearInterval(dom.scrollProp.intervalId);
            } else {
              var scroll = ((dom.scrollProp.dx * 50) / 200);
              dom.scrollLeft += Math.ceil(scroll);
              this.tick++;   
            }
          }.bind(new Object),1);
        }
      },
      addBannerListMouseDownEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.addEventListener("mousedown", action, true);
      },
      addDocumentMouseUpEvent : function(action){
        document.addEventListener("mouseup", action, true);
      },
      addDocumentMouseMoveEvent : function(action){
        document.addEventListener("mousemove", action, true);
      },
      addBannerListTouchStartEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.addEventListener("touchstart", action, true);
      },
      addBannerListTouchMoveEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.addEventListener("touchmove", action, true);
      },
      addBannerListTouchEndEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.addEventListener("touchend", action, true);
      },
      // Функция для добавления события на скролл
      // Функция принимает событие
      addWindowScrollEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
          debagList.push("117");
        }
        // Добавление события на скролл
        window.addEventListener("scroll", action);
      },
      // Функция для добавления события на зумирование окна
      // Функция принимает событие
      addWindowZoomEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
          debagList.push("121");
        }
        // Объявление html узла крестика в листинге офферов
        var button = document.getElementById("pt-banner-close__list");
        // Добавление события на клик
        button.addEventListener("click", action);
      },
      addBannerListScrollEvent : function (action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.addEventListener("wheel", action);
      },
      removeBannerListTouchStartEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.removeEventListener("touchstart", action);
      },
      removeBannerListTouchMoveEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.removeEventListener("touchmove", action);
      },
      removeBannerListTouchEndEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.removeEventListener("touchend", action);
      },
      removeBannerListMouseDownEvenet : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.removeEventListener("mousedown", action);
      },
      removeDocumentMouseUpEvent : function (action){
        document.removeEventListener("mouseup", action);
      },
      removeDocumentMouseMoveEvent : function(action){
        document.removeEventListener("mousemove", action);
      },
      removeBannerListScrollEvent : function(action){
        var dom = document.getElementById("pt-banner-scroll");
        dom.removeEventListener("wheel", action);
      },
      // Функция для удаления события при скроллинге
      // Функция принимает событие
      removeWindowScrollEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
          debagList.push("122");
        }
        // Удаление события
        window.removeEventListener("scroll", action);
      },
      // Функция для удаления события при зуме окна
      // Функция принимает событие
      removeWindowZoomEvent : function(action){
        var config = PRESSTAKE_BANNER_CORE.CONFIG;
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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
        // Если переключатель записи ошибок положителен то
        if (config.debag == true){
          // объявляем листинг для записи ошибок
          var debagList = config.debagList;
        }
        // Если нет функции действия и объявлен листинг для записи ошибок то
        if (!action && debagList){
          // Запишем ошибку
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

PRESSTAKE_BANNER_CORE.init({
  URL : {
    TARGET_URL : window.location.host + window.location.pathname,
    PASRSE_URL : "requests/parse",
    APPS_URL : "requests/gadgets",
    STAT_URL : "requests/stat",
    TRACKING_URL : "requests/track",
    CSS_URL : "css/style.css"
  }
});