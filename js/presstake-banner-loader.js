var PRESSTAKE_BANNER_CORE = {
    COMMON : {
        scheme : {
          isHttps : function() {
              return ('https:' === document.location.protocol);
          },
          get : function() {
              return (PRESSTAKE_BANNER_CORE.COMMON.scheme.isHttps() ? 'https://' : 'http://');
          }
        },
        ajax : function (url, callback, callbackError){
            var req = new XMLHttpRequest();

            req.open('GET', url, true);
            req.send();

            req.onreadystatechange = function() {
               var res;

               if (req.readyState != 4){			//если запрос не завершен, ничего не делаем
                  return;
               }
               if (req.status != 200) {			//если запрос вернул статус, отличный от 200, вызываем коллбек для ошибки
                  if (callbackError) {
                     callbackError();
                  };
               } else {
                  res = JSON.parse(req.responseText);
                  if(callback) {
                    callback(res);
                  }
               }
            };
        },
        getOS : function() {										//определяем операционную систему
            var ua = navigator.userAgent;

            if (ua.match(/Windows Phone/i)) {
                    return 'other';
            }

            if (ua.match(/Android/i)) {
                    return 'android';
            }
            if (ua.match(/iPhone|iPad|iPod/i)) {
                    return 'apple';
            }

            return 'other';
        },
        loadCSS : function (url){
            var link = document.createElement('link');

            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', url);

            document.querySelector('head').appendChild(link);
        },
        loadJS : function (url){
            var script 	= document.createElement('script');

            script.setAttribute('src', url);

            document.querySelector('head').appendChild(script);
        },
        debug : {
            active : 0,
            container : {},
            steps: [1,2],
            isActive : function() {
                return this.active == 1;
            },
            setPlatform: function(pl) {
                PRESSTAKE_BANNER_CORE.CONFIG.requestOs = (pl === 'apple'?'ios':pl);
                PRESSTAKE_BANNER_CORE.CONFIG.os = pl;
            },
            activeOnPage : function(loc) {
                return (window.location.href.indexOf(loc));
            },
            start: function(pl,pageLoc) {
                if(!this.isActive()) {
                    return false;
                }

                this.setPlatform(pl);
                this.activeOnPage(pageLoc);

                this.step(1);

                return true;
            },
            step : function(step) {
                if(this.steps.indexOf(step) < 0) {
                    return false;
                }

                if(step == 1 && this.container.hasOwnProperty('LOADER')) {
                    this.container.LOADER.loader.load(
                        {
                            clid:PRESSTAKE_BANNER_CORE.CONFIG.clid,
                            bid:PRESSTAKE_BANNER_CORE.CONFIG.bid,
                            loc:window.location.href
                        });
                }

                if(step == 2 && this.container.hasOwnProperty('OPERATION_SYSTEM')) {
                    this.container.OPERATION_SYSTEM.BANNER.setBannerOS({os:PRESSTAKE_BANNER_CORE.CONFIG.os});
                    this.container.OPERATION_SYSTEM.BANNER.LIST.loadAppsList();
                }

                return true;
            }
        }
    },
    DOM : {
        styleId : 'styles_js_pt_zoom',
        addStyle : function (style) {
            var styleElement = document.getElementById(PRESSTAKE_BANNER_CORE.DOM.styleId);

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.id = PRESSTAKE_BANNER_CORE.DOM.styleId;
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            } else {
                var tn = styleElement.childNodes[0];

                if(tn) {
                    styleElement.removeChild(tn);
                }

                var tn = styleElement.childNodes[0];

                if(tn) {
                    styleElement.removeChild(tn);
                }
            }

            styleElement.appendChild(document.createTextNode(style));
        },
        hasClass : function (element, cl){
                return element.classList ? element.classList.contains(cl) : false;
        },
        changeClass : function (el, from, to){
                el
                        .classList
                        .remove(from);
                el
                        .classList
                        .add(to);
        },
        parents : function (element, cl){
            var tmp = element,
                    parent;

            while (!parent) {
                    tmp = tmp.parentNode;
                    if (!tmp) {
                            return false;
                    }
                    if (PRESSTAKE_BANNER_CORE.DOM.hasClass(tmp, cl)) {
                            parent = tmp;
                    }
            }

            return parent;
        }
    },
    WINDOW : {
        scrollPercent : function () {
            var win_height = document.documentElement.clientHeight,
                       doc_height = Math.max(
                                                       document.body.scrollHeight, document.documentElement.scrollHeight,
                                                       document.body.offsetHeight, document.documentElement.offsetHeight,
                                                       document.body.clientHeight, document.documentElement.clientHeight
                                               ),
                       delta 	   = doc_height - win_height,
                       scroll_now = window.pageYOffset,
                       percent    = delta > 0 ? scroll_now / delta * 100 : 100;

            return percent;
        },
        SCALE : {
            size: {
              h:0,
              w:0
            },
            isWorking : function() {

                var scale_h = 0,scale_w = 0;

                var window_h = parseInt(window.innerHeight);
                var window_w = parseInt(window.innerWidth);

                if(document.documentElement.clientHeight != window_h) {
                    if(PRESSTAKE_BANNER_CORE.WINDOW.SCALE.size.h == 0 || PRESSTAKE_BANNER_CORE.WINDOW.SCALE.size.h != window_h) {
                        PRESSTAKE_BANNER_CORE.WINDOW.SCALE.size.h = window_h;
                        scale_h = 1;
                    }
                }

                if(document.documentElement.clientWidth != window_w) {
                    if(PRESSTAKE_BANNER_CORE.WINDOW.SCALE.size.w != window_w) {
                        PRESSTAKE_BANNER_CORE.WINDOW.SCALE.size.w = window_w;
                        scale_w = 1;
                    }
                }

                return (scale_h || scale_w);
            },
            ZOOM : {
                getZoomLevel : function() {
                    return document.documentElement.clientHeight/window.innerHeight;
                },
                getZoomLevelCompensation : function() {
                    return (1/PRESSTAKE_BANNER_CORE.WINDOW.SCALE.ZOOM.getZoomLevel());
                },
                getZoomLevelH : function() {
                    return document.documentElement.clientHeight/window.innerHeight;
                },
                getZoomLevelW : function() {
                    return document.documentElement.clientWidth/window.innerWidth;
                },
                getZoomLevelCompensationDim : function() {
                    return {
                        h:(1/PRESSTAKE_BANNER_CORE.WINDOW.SCALE.ZOOM.getZoomLevelH()),
                        w:(1/PRESSTAKE_BANNER_CORE.WINDOW.SCALE.ZOOM.getZoomLevelW())
                    };
                }
            },
            SCROOL : {
                offset: {
                    l:0,
                    t:0
                },
                checkOffset : function() {
                    var scroll_l = PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.getLeftPos();
                    var scroll_t = PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.getTopPos();

                    if(PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.l == 0 || PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.l != scroll_l) {
                        PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.l = scroll_l;
                    }

                    if(PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.t == 0 || PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.t != scroll_t) {
                        PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.t = scroll_t;
                    }

                    return true;
                },
                getLeftPos : function() {
                    return  parseInt(window.pageXOffset);
                },
                getTopPos : function() {
                    return  parseInt(window.pageYOffset+window.innerHeight);
                },
                getLeftOffset : function () {
                    return PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.l - PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.getLeftPos();
                },
                getTopOffset : function () {
                    return PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.offset.t - PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.getTopPos();
                },
                getOffset : function () {
                    return {
                        left: PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.getLeftOffset(),
                        top: PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCROOL.getTopOffset()
                    };
                }
            },
            SCALE : {
                base : {
                    scaleContent : null,
                    initWidth: null,
                    isBased : false,
                    scale: false
                },
                addMetaScale : function () {
                    if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scale) {
                        return false;
                    }

                    var viewportmeta = document.querySelector('meta[name="viewport"]');

                    if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.initWidth) {
                        PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.initWidth = document.documentElement.clientWidth;
                    }

                    if(viewportmeta == null) {
                        var head = document.querySelector('head');
                        var meta = document.createElement('meta');

                        meta.name="viewport";
                        meta.content="";//width=device-width,

                        head.appendChild(meta);

                    } else {
                        if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.isBased) {
                            if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scaleContent) {
                                PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scaleContent = viewportmeta.content;
                            }
                        }
                    }

                    if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.isBased) {
                        PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.isBased = true;
                    }
                },
                disable : function() {
                    if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scale) {
                        return false;
                    }

                    if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.isScaleAllow()) {
                        return true;
                    }

                    PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.addMetaScale();
                    var viewportmeta = document.querySelector('meta[name="viewport"]');

                    viewportmeta.content = 'width=device-width,user-scalable=no';//width=device-width,

                    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                        if (viewportmeta) {
                            viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
                            document.body.addEventListener('gesturestart', function () {
                                viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
                            }, false);
                        }
                    } else {
                       viewportmeta.content = 'width=device-width, user-scalable=no';
                    }
                },
                enable : function() {
                    if(!PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scale) {
                        return false;
                    }

                    if(PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.isScaleAllow()) {
                        return true;
                    }

                    //<meta name="viewport" content="width=device-width, initial-scale=1">
                    PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.addMetaScale();

                    var viewportmeta = document.querySelector('meta[name="viewport"]');

                    if(PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.isBased && PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scaleContent) {
                        viewportmeta.content = PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.scaleContent;

                        return true;
                    }

                    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
                        document.body.addEventListener('gesturestart', function () {
                            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
                        }, false);
                    } else {
                        viewportmeta.content = 'width=' + PRESSTAKE_BANNER_CORE.WINDOW.SCALE.SCALE.base.initWidth + 'user-scalable=1';//width=device-width,
                    }

                },
                isScaleAllow : function() {
                    var viewportmeta = document.querySelector('meta[name="viewport"]');

                    if(viewportmeta) {

                       if((viewportmeta.content.match(/user\-scalable=no/) != null)) {
                           return false;
                       }

                       var isMinScaleStop = (viewportmeta.content.match(/(minimum\-scale=1\.0)/) != null);
                       var isMaxScaleStop = (viewportmeta.content.match(/(maximum\-scale=1\.0)/) != null);

                       return !(isMinScaleStop && isMaxScaleStop);

                    } else {
                        return true;
                    }
                }
            }
        }
    },
    REPEATER : {
        getInstance : function(config) {
            /*var returnCount = this.count;
            this.instance[returnCount].counter = conf.counter;
            this.instance[returnCount].timeout = conf.timeout;
            this.count++;*/

            return {
                CONFIG: {
                    timeout : config.timeout,
                    counter : config.counter
                },
                DEFAULT : {
                    timeout : config.timeout,//через какое время повторять запрос
                    counter : config.counter
                },
                retry: function(func) {PRESSTAKE_BANNER_CORE.REPEATER.retry(this.CONFIG,func);},
                clear: function() {PRESSTAKE_BANNER_CORE.REPEATER.clear(this.CONFIG,this.DEFAULT);},
                setDefaults : function(conf) {PRESSTAKE_BANNER_CORE.REPEATER.setDefaults(this.DEFAULT,conf);}
            };
        },
        retry : function (instance,func){//повторяем запрос к серверу, если еще не закончился лимит повторов
            if(typeof func === 'undefined')
                return false;

            if (instance.counter > 0) {
                setTimeout(function(){
                        func();
                }, instance.timeout);
            }
            instance.counter--;
        },
        clear : function(instance,def){
            instance.timeout = def.timeout;
            instance.counter = def.counter;
        },
        setDefaults : function(def,conf) {
            def.timeout = conf.timeout;
            def.counter = conf.counter;
        }
    },
    URL_BUILDER : {
        url:{
            TARGET_URL          :  '',
            URL_PARSE 		:  'bpage/banner.php', 	//url серверного скрипта, на который надо посылать запрос парсинга (обработки) страницы
            URL_APPS 		:  'banner/index.php', 		//url серверного скрипта, на который надо посылать запрос для получения списка приложений
            URL_STAT 		:  'stat/index.php', 		//url серверного скрипта, на который надо посылать запрос для получения списка приложений
            URL_SUBSCRIBE       :  'subscribe/index.php', 		//url серверного скрипта, на который надо посылать запрос для подписки пользователя на выход приложения
            URL_UNSUBSCRIBE     :  'subscribe/index.php', 		//url серверного скрипта, на который надо посылать запрос для отмены подписки пользователя на выход приложения
            URL_TRACKING        :  'tracking/index.php', 		//url серверного скрипта, на который надо посылать запрос для редиректа на маркет
            URL_CSS		:  'banner-client/css/presstake-banner.css', 	//url файла стилей
            URL_JS		:  'banner-client/js/presstake-banner.js'
        },
        builder: {
            getParent : function() {
                return  PRESSTAKE_BANNER_CORE.URL_BUILDER;
            },
            createBcCSSUrl : function() {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_CSS;
            },
            createBcJSUrl : function() {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_JS;
            },
            createCheckLoadingUrl : function (data) {
               return  this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_PARSE +
                    '?clid=' + encodeURIComponent(data.clid) +
                    '&bid='  + encodeURIComponent(data.bid) +
                    '&loc='  + encodeURIComponent(data.loc) +
                    '&action=pgst';
            },
            createLoadListUrl : function(data) {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_APPS +
                    '?clid='  + encodeURIComponent(data.clid) +
                    '&bid='   + encodeURIComponent(data.bid) +
                    '&pgid='  + encodeURIComponent(data.pgid) +
                    '&os='    + encodeURIComponent(data.requestOs) +
                    '&banid=' + encodeURIComponent(data.banid);
            },
            createClickOnBannerUrl : function(data) {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_STAT +
                    '?clid='  + encodeURIComponent(data.clid) +
                    '&bid='   + encodeURIComponent(data.bid) +
                    '&pgid='  + encodeURIComponent(data.pgid) +
                    '&ovid=' + encodeURIComponent(data.banid);
            },
            createStatVisibleBannerUrl : function(data) {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_STAT +
                    '?clid='  + encodeURIComponent(data.clid) +
                    '&bid='   + encodeURIComponent(data.bid) +
                    '&pgid='  + encodeURIComponent(data.pgid) +
                    '&ovid=' + encodeURIComponent(data.banid) +
                    '&action=vis';
            },
            createStatCloseBannerUrl : function(data) {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_STAT +
                    '?clid='  + encodeURIComponent(data.clid) +
                    '&bid='   + encodeURIComponent(data.bid) +
                    '&pgid='  + encodeURIComponent(data.pgid) +
                    '&ovid=' + encodeURIComponent(data.banid) +
                    '&action=cl';
            },
            createTrackingUrl : function(data) {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_TRACKING +
                    '?clid=' + encodeURIComponent(data.clid) +
                    '&bid='  + encodeURIComponent(data.bid) +
                    '&pgid=' + encodeURIComponent(data.pgid) +
                    '&item=' + encodeURIComponent(data.sitid) +
                    '&ovid=' + encodeURIComponent(data.banid);
            },
            createSubscribe : function(data) {
                data.action = 'sb';

                return this.__subscribe(data);
            },
            createUnsubscribe : function(data) {
                data.action = 'unsb';

                return this.__subscribe(data);
            },
            __subscribe : function(data) {
                return this.getParent().url.TARGET_URL +
                    this.getParent().url.URL_SUBSCRIBE +
                    '?id=' + encodeURIComponent(data.id) +
                    '&banid=' + encodeURIComponent(data.banid) +
                    '&email=' + encodeURIComponent(data.email) +
                    '&os=' + encodeURIComponent(data.os) +
                    '&action=' + encodeURIComponent(data.action);
            }
        }
    },
    BANNER_LOADER : {
        status:{
            STATUS_OK : 1,//статус "есть данные, загружаем баннер"
            STATUS_DATA_LOADING : 2, //статус "страница обрабатывается"
            STATUS_NO_DATA : 3
        }
    },
    STATISTIC : {
        fclickOnBan: 0,
        fvisBan: 0,
        fsendStatCloseBan: 0,
        fhasData: 0,
        fsendStatVisBan: 0,
        clickOnBanner : function(data) {
            if(this.fclickOnBan === 0) {
                this.fclickOnBan = 1;
                PRESSTAKE_BANNER_CORE.COMMON.ajax(PRESSTAKE_BANNER_CORE.URL_BUILDER.builder.createClickOnBannerUrl(data));
            }
        },
        clickVisibleBanner : function(data,opt) {
            if(opt !== null && typeof opt === 'object') {
                PRESSTAKE_BANNER_CORE.STATISTIC._prepareSettings(opt);
            }

            if(
                this.fhasData === 1
                && this.fvisBan === 1
                && this.fsendStatVisBan === 0
            ) {
                this.fsendStatVisBan = 1;
                PRESSTAKE_BANNER_CORE.COMMON.ajax(PRESSTAKE_BANNER_CORE.URL_BUILDER.builder.createStatVisibleBannerUrl(data));
             }
        },
        clickCloseBanner : function(data,opt) {
            if(
               this.fsendStatCloseBan === 0
            ) {
                this.fsendStatCloseBan = 1;

                PRESSTAKE_BANNER_CORE.COMMON.ajax(PRESSTAKE_BANNER_CORE.URL_BUILDER.builder.createStatCloseBannerUrl(data));
             }
        },
        setHasData : function() {
            this.fhasData = 1;
        },
        setVisibleBannerByScroll : function() {
            this.fvisBan = 1;
        },
        _prepareSettings : function(opt) {
            if(
                "fhasData" in opt
                && opt.fhasData === 1
            ){
               this.fhasData = opt.fhasData;
            }

            if(
                "fvisBan" in opt
                && opt.fvisBan === 1
            ){
               this.fvisBan = opt.fvisBan;
            }
        }

    },
    CONFIG : {}
};

(function(core){

        var COMMON = core.COMMON;
        var URL_BUILDER = core.URL_BUILDER;

        var loader = document.getElementById('presstake-banner-loader'),
            CLID = loader.getAttribute('data-clid'),	//client_id
            BID = loader.getAttribute('data-bid'),	//blog_id
            REPEAT_TIMEOUT = 30 * 1000,	//через какое время повторять запрос, если страница еще обрабатывается
            REPEAT_COUNTER  = 3, //сколько раз повторять запрос
            TARGET_URL = core.COMMON.scheme.get() + 'localhost/presstake-banner/',
            loc = window.location.href,	//адрес страницы
            os = COMMON.getOS(),
            requestOs = (os === 'apple'?'ios':os);
            core.CONFIG = {	//данные, которые позже будут переданы в баннер
                    clid: CLID,
                    bid:  BID,
                    os:   os,
                    requestOs: requestOs,
                    repeat_timeout: REPEAT_TIMEOUT,
                    repeat_counter: REPEAT_COUNTER
            };

        URL_BUILDER.url.TARGET_URL = TARGET_URL;

        var REPEATER = core.REPEATER.getInstance({timeout:REPEAT_TIMEOUT,counter:REPEAT_COUNTER});
        REPEATER.clear();


        var PRESSTAKE_BANNER_LOADER = {
            status: core.BANNER_LOADER.status,
            loaded: 0,
            loader : {
                 load: function(conf) {
                      url = URL_BUILDER.builder.createCheckLoadingUrl(
                            {
                                clid:conf.clid,
                                bid:conf.bid,
                                loc:conf.loc
                            }
                        );

                    COMMON.ajax(
                        url,
                        PRESSTAKE_BANNER_LOADER.loader.success,
                        PRESSTAKE_BANNER_LOADER.loader.fail
                    );
                 },
                 success : function(res) {

                    if (res.requestStatus != 200) {				//если запрос прошел, но сервер вернул requestStatus отличный от 200, пытаемся повторить
                            PRESSTAKE_BANNER_LOADER.loader.fail();
                    } else if (res.status == PRESSTAKE_BANNER_LOADER.status.STATUS_DATA_LOADING) { 	//если вернулся статус "страница обрабатывается" - пытаемся повторить
                            PRESSTAKE_BANNER_LOADER.loader.fail();
                    } else if (res.status == PRESSTAKE_BANNER_LOADER.status.STATUS_OK) {		//если вернулся статус "есть данные" - загружаем сам баннер
                            core.CONFIG.pgid 	= res.page;				//дополняем данные, которые будут переданы в баннер
                            core.CONFIG.banid     = res.banId;
                            core.CONFIG.url = URL_BUILDER.builder.createLoadListUrl(core.CONFIG); //формируем url для запроса списка приложений

                            if(
                               PRESSTAKE_BANNER_LOADER.loaded == 0
                            ) {
                                PRESSTAKE_BANNER_LOADER.loader.loadCSS();								//загружаем стили и скрипты баннера
                                PRESSTAKE_BANNER_LOADER.loader.loadJS();
                                PRESSTAKE_BANNER_LOADER.loaded = 1;
                            }

                            REPEATER.clear();//by success set as new

                            if( core.COMMON.debug.isActive() && PRESSTAKE_BANNER_LOADER.loaded == 1) {
                                core.COMMON.debug.step(2);
                            }
                    }
                },
                fail : function() {
                    REPEATER.retry(
                        function(){
                            PRESSTAKE_BANNER_LOADER.loader.load({clid:CLID,bid:BID,loc:loc})
                        }
                    );
                },
                loadCSS : function () {								//загружаем стили для баннера
                    COMMON.loadCSS(URL_BUILDER.builder.createBcCSSUrl());
                },
                loadJS : function (){										//загружаем скрипты (они же генерируют html)
                    COMMON.loadJS(URL_BUILDER.builder.createBcJSUrl());
                }
            }
        };

        PRESSTAKE_BANNER_LOADER.loader.load({clid:CLID,bid:BID,loc:loc});

        if(core.COMMON.debug.isActive()) {
           core.COMMON.debug.container.LOADER =  PRESSTAKE_BANNER_LOADER;
        }

})(PRESSTAKE_BANNER_CORE);
