PRESSTAKE_BANNER = (function(core){

	var
                CORE = core,
                banner_data = core.CONFIG,
		banner_id 	= 'presstake-banner-' + banner_data.banid,
		banner, banner_cl, list, classes;

        var SCALE = core.WINDOW.SCALE;

            SCALE.SCALE.base.scale = false;

            SCALE.SCROOL.getTopPos = function() {
                return parseInt(window.pageYOffset);
            };

            SCALE.SCROOL.checkOffsetInZoom = function() {
                SCALE.SCROOL.offset.oldw = SCALE.ZOOM.getZoomLevel();
                SCALE.SCROOL.checkOffset();
            };

        var SYSTEM = {
            CONTROL : {
                //служебные функции
                 ajax : function (url, callback, callback_error) {
                    CORE.COMMON.ajax(url, callback, callback_error);
                 },
                 hasClass : function (element, cl){
                    return core.DOM.hasClass(element, cl);
                 },
                 changeClass : function (el, from, to){
                    core.DOM.changeClass(el, from, to);
                 },
                 parents : function (element, cl){
                    return core.DOM.parents(element, cl);
                 },
                 scrollPercent : function () {
                    return core.WINDOW.scrollPercent();
                 },
                 //проверка на прокрутку страницы на 25%, прежде чем появится баннер
                 scrollCheck : function (){

                        var percent = SYSTEM.CONTROL.scrollPercent();
                        if (percent > 25) {
                            SYSTEM.BANNER.visibleBanner();

                            CORE.STATISTIC.clickVisibleBanner({
                                    clid : banner_data.clid,
                                    bid : banner_data.bid,
                                    banid : banner_data.banid,
                                    pgid : banner_data.pgid
                                },{fvisBan:1});
                        }
                },
                debug : function() {
                    //загрузка данных
                    SYSTEM.BANNER.LIST.loadAppsList();
                }
            },
            OPERATIONS : {
                BANNER : {
                    closeBanner : function() {
                            SYSTEM.BANNER.closeBanner();
                            CORE.STATISTIC.clickCloseBanner(
                                {
                                    clid : banner_data.clid,
                                    bid : banner_data.bid,
                                    banid : banner_data.banid,
                                    pgid : banner_data.pgid
                                }
                            );
                    },
                    LIST : {
                        renderList : function () {
                            if(SYSTEM.BANNER.LIST.isListOpen()) {
                                SCALE.SCALE.enable();
                                SYSTEM.BANNER.LIST.ITEM.sizeCheck();
                                SYSTEM.OPERATIONS.BANNER.LIST.closeList();
                            } else {
                                SCALE.SCALE.disable();
                                SYSTEM.BANNER.LIST.ITEM.sizeCheck();
                                SYSTEM.OPERATIONS.BANNER.LIST.openList();
                            }
                        },
                        openList : function() {
                              SYSTEM.BANNER.LIST.openList();

                              CORE.STATISTIC.clickOnBanner({
                                  clid : banner_data.clid,
                                  bid : banner_data.bid,
                                  banid : banner_data.banid,
                                  pgid : banner_data.pgid
                              });
                        },
                        closeList : function() {
                              SYSTEM.BANNER.LIST.closeList();
                        }
                    }
                }
            },
            BANNER : {
                 isVis : false,
                 isHas : false,
                 //управление баннером
                 visibleBanner : function() {
                    banner_cl.add(classes.banner_scroll);
                    if(!this.isVis) {
                        this.isVis = true;
                    }
                    this.additionalCheck();
                 },
                 setHasData : function () {
                    banner_cl.add(classes.banner_has_data);
                    if(!this.isHas) {
                        this.isHas = true;
                    }
                    this.additionalCheck();
                 },
                 openBanner : function () {
                    banner_cl.remove(classes.banner_hidden);
                 },
                 closeBanner : function () {
                    banner_cl.add(classes.banner_hidden);
                 },
                 additionalCheck : function() {
                     if(this.isVis && this.isHas) {
                        SCALE.SCROOL.checkOffsetInZoom();
                    }
                 },
                 createBaseHTML : function (){
                        var body 	= document.querySelector('body'),
                                banner  = document.createElement('div'),
                                content = 	[
                                                                '<div class="pt-banner-main">',
                                                                        '<div class="pt-banner-main__logo">',
                                                                                '<div class="pt-banner-main__arrow"></div>',
                                                                        '</div>',
                                                                        '<div class="pt-banner-main__call-to-action">',
                                                                                '<div class="pt-banner-main__text">',
                                                                                        'Приложения, музыка и товары на этой странице',
                                                                                '</div>',
                                                                                '<div class="pt-banner-main__logo-appstore"></div>',
                                                                                '<div class="pt-banner-main__logo-gplay"></div>',
                                                                                '<div class="pt-banner-main__empty_cell"></div>',
                                                                        '</div>',
                                                                        '<div class="pt-banner-main__go-to-privacy">',
                                                                                '<a href="'+ core.COMMON.scheme.get() + 'www.presstake.com/landing/" rel="nofollow" class="pt-banner-main__go-to-privacy-link" target="_blank">Powered by PressTake</a>',
                                                                        '</div>',
                                                                        '<div class="pt-banner-main__go-to-site">',
                                                                                '<div class="pt-banner-main__text">',
                                                                                        'Узнать больше о ',
                                                                                        '<a href="'+ core.COMMON.scheme.get() + 'www.presstake.com/landing/"  rel="nofollow" class="pt-banner-main__go-to-site-link" target="_blank">PressTake</a>',
                                                                                '</div>',
                                                                        '</div>',
                                                                '</div>',
                                                                '<div class="pt-banner-overlay"></div>',
                                                                '<button type="button" class="pt-banner__close pt-banner__close--banner"></button>',
                                                                '<div class="pt-banner-list">',
                                                                        '<button type="button" class="pt-banner__close pt-banner__close--list"></button>',
                                                                '</div>'
                                                        ].join('');

                        banner.setAttribute('id', banner_id);
                        banner.classList.add('pt-banner');
                        banner.classList.add('pt-banner--os-' + banner_data.os);
                        banner.innerHTML = content;
                        banner.style.display = 'none';

                        //document.querySelector('.presstake-data-container').appendChild(banner);
                        var noindex = document.createElement('noindex');
                        noindex.appendChild(banner);
                        body.appendChild(noindex);
                 },
                 setBannerOS : function(banner_data) {
                     banner.classList.remove('pt-banner--os-other');
                     banner.classList.remove('pt-banner--os-apple');
                     banner.classList.remove('pt-banner--os-android');
                     banner.classList.add('pt-banner--os-' + banner_data.os);
                 },
                 //обработчики событий
                 initListeners : function (){
                        banner
                                .addEventListener('click', function(event){

                                        var t = event.target;

                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner-main__go-to-privacy-link') || SYSTEM.CONTROL.hasClass(t, 'pt-banner-main__go-to-site-link')) {
                                                return true;
                                        }

                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner__close--banner')) {
                                                SYSTEM.OPERATIONS.BANNER.closeBanner();
                                        }
                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner__close--list') /*|| SYSTEM.CONTROL.hasClass(t, 'pt-banner-overlay')*/) {
                                                SCALE.SCALE.enable();
                                                SYSTEM.BANNER.LIST.ITEM.sizeCheck();
                                                SYSTEM.OPERATIONS.BANNER.LIST.closeList();
                                        }
                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner-item__link--subscribe')) {
                                                SYSTEM.BANNER.LIST.ITEM.subscribeOpenForm(t);
                                        }
                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner-subscribe__button') && !SYSTEM.CONTROL.hasClass(t, 'pt-banner-subscribe__button--disabled')) {
                                                SYSTEM.BANNER.LIST.ITEM.subscribeSubmit(t);
                                        }
                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner-item__link--subscribe-done')) {
                                                SYSTEM.BANNER.LIST.ITEM.subscribeCancel(t);
                                        }
                                });

                        banner
                                .addEventListener('change', function(event){
                                        if (SYSTEM.CONTROL.hasClass(event.target, 'pt-banner-subscribe__field') || SYSTEM.CONTROL.hasClass(event.target, 'pt-banner-subscribe__agree-checkbox') ) {
                                                SYSTEM.BANNER.LIST.ITEM.checkSubscribeForm(event.target);
                                        }
                                });

                        banner
                                .querySelector('.pt-banner-main')
                                .addEventListener('click', function(event){

                                        var t = event.target;

                                        if (SYSTEM.CONTROL.hasClass(t, 'pt-banner-main__go-to-privacy-link') || SYSTEM.CONTROL.hasClass(t, 'pt-banner-main__go-to-site-link')) {
                                                return true;
                                        }

                                        SYSTEM.OPERATIONS.BANNER.LIST.renderList();
                                });

                        SYSTEM.CONTROL.scrollCheck();

                        window.addEventListener('scroll', function(){SYSTEM.CONTROL.scrollCheck();SYSTEM.BANNER.LIST.ITEM.sizeToZoom();});
                        window.addEventListener('resize', SYSTEM.BANNER.LIST.ITEM.sizeCheck);
                        window.addEventListener('touchend', function() {if(SCALE.isWorking()) {SYSTEM.BANNER.LIST.ITEM.sizeToZoom();}});
                 },
                 applyTemplateResponse : function (response) {
                    if(response.hasOwnProperty('responseType')) {
                        var templateResponse =  response.responseType;
                        var mainText = banner.querySelector('.pt-banner-main__text');
                        if(templateResponse == 1) {
                            mainText.innerHTML = 'Приложения, музыка и товары на этой странице';
                        } else if(templateResponse == 2) {
                            mainText.innerHTML = 'Нажми, чтобы увидеть больше предложений';
                        }
                    }
                 },

                 LIST : {
                     openList : function (){
                        banner_cl.add(classes.list_open);
                     },

                     closeList : function (){
                        banner_cl.remove(classes.list_open);
                     },

                     isListOpen : function (){
                        return banner_cl.contains(classes.list_open);
                     },

                     clearList : function (){								//очищаем лист приложений
                            list
                                .innerHTML = '<button type="button" class="pt-banner__close pt-banner__close--list"></button>';
                    },
                    //загрузка данных

                    loadAppsList : function (){
                            SYSTEM.CONTROL.ajax(
                                banner_data.url,
                                SYSTEM.BANNER.LIST.renderAppsList,
                                SYSTEM.BANNER.LIST.loadAppsListRepeat
                            );
                    },

                    loadAppsListRepeat : function (){							//повторяем запрос к серверу, если еще не закончился лимит повторов
                            if (banner_data.repeat_counter > 0) {
                                    setTimeout(function(){
                                            SYSTEM.BANNER.LIST.loadAppsList();
                                    }, banner_data.repeat_timeout);
                            }
                            banner_data.repeat_counter--;
                    },

                    renderAppsList : function (response){
                            if (response.status != 1 && response.status != 3) {					//если запрос прошел, но сервер вернул статус отличный от 1 и 3, пытаемся повторить
                                    SYSTEM.BANNER.LIST.loadAppsListRepeat();
                            } else if (response.status == 1) {
                                    SYSTEM.BANNER.LIST.clearList();

                                    SYSTEM.BANNER.applyTemplateResponse(response);

                                    var i=0;
                                    var addedRecommended = 0;
                                    for(var index in response.data ) {
                                        if(i>4) {
                                            break;
                                        }

                                        if(
                                            !(
                                                response.data.hasOwnProperty(index)
                                                && response.data[index].hasOwnProperty('id')
                                                && response.data[index].hasOwnProperty('tmpltype')
                                            )
                                        ) {
                                            continue;
                                        }

                                        if(
                                            addedRecommended == 0
                                            && response.data[index].tmpltype == 2
                                        ) {
                                            SYSTEM.BANNER.LIST.ITEM.addRecommendedTitle();
                                            addedRecommended = 1;
                                        }

                                        SYSTEM.BANNER.LIST.ITEM.renderListItem(response.data[index]);

                                        i++;
                                    }

                                    SYSTEM.BANNER.setHasData();
                                    SYSTEM.BANNER.LIST.ITEM.sizeCheck();

                                    CORE.STATISTIC.clickVisibleBanner({
                                        clid : banner_data.clid,
                                        bid : banner_data.bid,
                                        banid : banner_data.banid,
                                        pgid : banner_data.pgid
                                    },{fhasData:1});
                            }
                    },

                    ITEM : {
                            REQUESTS : {
                                subscribe : function (request,callback){
                                    SYSTEM.CONTROL.ajax(
                                        CORE.URL_BUILDER.builder.createSubscribe(request),
                                        callback
                                    );
                                },
                                unsubscribe : function (request,callback){
                                    SYSTEM.CONTROL.ajax(
                                        CORE.URL_BUILDER.builder.createUnsubscribe(request),
                                        callback
                                    );
                                }
                            },
                            subscribeOpenForm : function (button){
                                    var item 	= SYSTEM.CONTROL.parents(button, 'pt-banner-item');

                                    if (banner_data.email) {
                                            item.querySelector('.pt-banner-subscribe__field').value = banner_data.email;
                                    }

                                    SYSTEM.CONTROL.changeClass(item, 'pt-banner-item--subscribe-offer', 'pt-banner-item--subscribe-enter-data');
                            },
                            checkSubscribeForm : function (element){
                                    var item 		= SYSTEM.CONTROL.parents(element, 'pt-banner-item'),
                                            id 			= item.getAttribute('data-id'),
                                            button_cl 	= item.querySelector('.pt-banner-subscribe__button').classList,
                                            email 		= item.querySelector('.pt-banner-subscribe__field').value,
                                            is_agree	= item.querySelector('.pt-banner-subscribe__agree-checkbox').checked;

                                    if (email && is_agree) {
                                            button_cl.remove('pt-banner-subscribe__button--disabled');
                                    } else {
                                            button_cl.add('pt-banner-subscribe__button--disabled');
                                    }
                            },
                            subscribeSubmit : function (button){
                                    var item 	= SYSTEM.CONTROL.parents(button, 'pt-banner-item'),
                                            id 		= item.getAttribute('data-id'),
                                            input 	= item.querySelector('.pt-banner-subscribe__field'),
                                            email 	= input.value;

                                    banner_data.email = email;

                                    var request = {
                                        id : id,
                                        email : email,
                                        banid : banner_data.banid,
                                        os : banner_data.requestOs
                                    };

                                    SYSTEM.BANNER.LIST.ITEM.REQUESTS.subscribe(
                                        request,
                                        function(){
                                            SYSTEM.CONTROL.changeClass(item, 'pt-banner-item--subscribe-enter-data', 'pt-banner-item--subscribe-done');
                                        }
                                    );
                            },
                            subscribeCancel : function (button){
                                    var item 	= SYSTEM.CONTROL.parents(button, 'pt-banner-item'),
                                            id 	= item.getAttribute('data-id'),
                                            input 	= item.querySelector('.pt-banner-subscribe__field'),
                                            email 	= banner_data.email;

                                    var request = {
                                        id : id,
                                        email : email,
                                        banid : banner_data.banid,
                                        os : banner_data.requestOs
                                    };

                                    SYSTEM.BANNER.LIST.ITEM.REQUESTS.unsubscribe(
                                        request,
                                        function(){
                                            SYSTEM.CONTROL.changeClass(item, 'pt-banner-item--subscribe-done', 'pt-banner-item--subscribe-offer');
                                        }
                                    );

                            },
                            sizeToZoom : function() {
                                return true;

                                var zoomLevel = SCALE.ZOOM.getZoomLevel();

                                if(zoomLevel > 0.80 && zoomLevel < 1.2) {
                                    banner_cl.remove('pt-banner-transform-zoom');
                                    banner_cl.remove('pt-banner-transform-to-lb0');
                                    if(banner_cl.contains('pt-banner-transform-zoom-gt1')) {
                                        banner_cl.remove('pt-banner-transform-zoom-gt1');
                                    }
                                    return true;
                                }

                                if(!banner_cl.contains('pt-banner-transform-zoom')) {
                                    banner_cl.add('pt-banner-transform-zoom');
                                    banner_cl.add('pt-banner-transform-to-lb0');
                                }

                                var zoomLevelApply = SCALE.ZOOM.getZoomLevelCompensationDim();

                                var style = '.pt-banner.pt-banner-transform-zoom.pt-banner-transform-zoom-gt1' +
                                    ' {' +
                                    '  -webkit-transform: scale(' + zoomLevelApply.w + ',' + zoomLevelApply.h + ') ' +
                                    '  translateX(' + (zoomLevel*SCALE.SCROOL.getLeftPos()) + 'px)  ' +
                                    //'  translateY(' + ((SCALE.SCROOL.offset.oldw*SCALE.SCROOL.offset.t)-(SCALE.SCROOL.getTopPos()*zoomLevel)) + 'px)  ' +
                                    ' !important;' +
                                    '  transform: scale(' + zoomLevelApply.w + ',' + zoomLevelApply.h + ') ' +
                                    '  translateX(' + (zoomLevel*SCALE.SCROOL.getLeftPos()) + 'px)  ' +
                                   // '  translateY(' + ((SCALE.SCROOL.offset.oldw*SCALE.SCROOL.offset.t)-(SCALE.SCROOL.getTopPos()*zoomLevel)) + 'px)  ' +
                                    ' !important;' +
                                    '}';

                                core.DOM.addStyle(style);

                                if(!banner_cl.contains('pt-banner-transform-zoom-gt1')) {
                                   banner_cl.add('pt-banner-transform-zoom-gt1');
                                }

                                SCALE.SCROOL.checkOffsetInZoom();
                            },
                            sizeCheck : function (){

                                    var window_h = parseInt(document.documentElement.clientHeight),
                                        //window_w = parseInt(document.documentElement.clientWidth);
                                            item_h		= parseInt(window_h / 7),
                                            items 		= list.querySelectorAll('.pt-banner-item--row'),
                                            images 		= list.querySelectorAll('.pt-banner-item__ptclmn--img'),
                                            double_cl 	= 'pt-banner-item--double-line',
                                            counter 	= 1;

                                    banner.style.height 	= item_h + 'px';
                                    //banner.style.width          = window_w + 'px';
                                    banner.style.fontSize 	= window_h / 100 * .6 + 'px';

                                    for (var i = 0, len = items.length; i < len; i++) {			//высота ячейки одного приложения
                                            items[i].style.height = item_h + 'px';
                                    }
                                    for (var i = 0, len = images.length; i < len; i++) {		//высота иконки приложения
                                            images[i].style.width = item_h + 'px';
                                    }
                                    for (var i = 0, len = items.length; i < len; i++) {			//рассчет высоты заголовка приложения
                                            var title 		= items[i].querySelector('.pt-banner-item__title'),
                                                    height 		= title.offsetHeight,
                                                    line_height	= parseFloat(window.getComputedStyle(title, null).getPropertyValue('font-size')),
                                                    lines 		= height / line_height;

                                            if (height > 0) {
                                                     items[i].setAttribute('data-counter', counter);
                                                     counter++;
                                            }

                                            lines > 1.5 ? items[i].classList.add(double_cl) : items[i].classList.remove(double_cl);		//если размер заголовка больше одной линии - добавляем соответствующий класс
                                    }

                                SYSTEM.BANNER.LIST.ITEM.sizeToZoom();
                            },
                            renderListItem : function (item) {

                                var image = item.image;

                                if(core.COMMON.scheme.isHttps()) {
                                    image = image.replace(/^http:/,'https:');
                                }

                                //функция формирует разметку для каждого приложения в списке
                                var element = document.createElement('div'),
                                        content = [
                                                                '<div class="pt-banner-item__col pt-banner-item__ptclmn--img">',//open 1
                                                                        '<img src="',
                                                                                image,
                                                                        '" class="pt-banner-item__img">',
                                                                '</div>',//close 1
                                                                '<div class="pt-banner-item__col pt-banner-item__ptclmn--text">',// open-2
                                                                        '<div class="pt-banner-item__title">',// open 3
                                                                                item.name,
                                                                        '</div>'// close 3
                                                ];

                                var contentSale = SYSTEM.BANNER.LIST.ITEM.addSaleContent(item,element);

                                element.classList.add('pt-banner-item');
                                element.classList.add('pt-banner-item--row');

                                if(item.tmpltype == 1) {
                                    element.classList.add('pt-banner-item-main');
                                } else if(item.tmpltype == 2) {
                                    element.classList.add('pt-banner-item-rec');
                                }

                                element.setAttribute('data-id', item.id);

                                element.innerHTML = content.join('') + contentSale.join('');

                                list.appendChild(element);

                                if (item.on_sale) {
                                    SYSTEM.BANNER.LIST.ITEM.addSaleClick(element);
                                }
                            },
                            addSaleClick : function(element) {
                                element.addEventListener('click', function(event){

                                        var t = event.target;

                                        if(SYSTEM.CONTROL.hasClass(t, 'pt-banner-item__link')) {
                                            //event.preventDefault();
                                            event.stopPropagation();
                                            return true;
                                        }

                                        var linkGotoTrack = element.querySelector('.pt-banner-item__link');

                                        if( linkGotoTrack !== null) {
                                            linkGotoTrack.click();
                                        }

                                        return true;
                                });
                            },
                            makeStoreLink : function(item,element) {

                                var linkClass;

                                if (item.itarget.appstore) {
                                    linkClass = 'pt-banner-item__link--appstore';
                                } else if (item.itarget.google_play) {
                                    linkClass = 'pt-banner-item__link--gplay';
                                } else {
                                    linkClass = 'pt-banner-item__link--other';
                                }

                                var request = {
                                        id : item.id,
                                        clid : banner_data.clid,
                                        bid : banner_data.bid,
                                        banid : banner_data.banid,
                                        pgid : banner_data.pgid,
                                        sitid : item.sitid
                                    };

                                return '<a href="' + CORE.URL_BUILDER.builder.createTrackingUrl(request) + '" target="_blank" class="pt-banner-item__link ' + linkClass + '"></a>';
                            },
                            markPlaftorm : function(item,element) {

                                if (item.pl.ios) {
                                    element.classList.add('pt-banner-item--appstore');
                                }
                                if (item.pl.android) {
                                    element.classList.add('pt-banner-item--gplay');
                                } else {
                                    element.classList.add('pt-banner-item--other');
                                }
                            },
                            addSaleContent : function(item,element) {
                                var content = [];
                                var subscribe;

                                if (item.on_sale) {
                                        content.push('<div class="pt-banner-item__price">' + /* item.price*/'' + '</div>');// open-close 4
                                        content.push('</div>'); //close 2
                                        content.push('<div class="pt-banner-item__col pt-banner-item__ptclmn--button">'); //open 5


                                        SYSTEM.BANNER.LIST.ITEM.markPlaftorm(item,element);
                                        content.push(SYSTEM.BANNER.LIST.ITEM.makeStoreLink(item,element));
                                        /*
                                        var request = {
                                            id : item.id,
                                            clid : banner_data.clid,
                                            bid : banner_data.bid,
                                            banid : banner_data.banid,
                                            pgid : banner_data.pgid,
                                            sitid : item.sitid
                                        };

                                        if (item.itarget.appstore) {
                                                element.classList.add('pt-banner-item--appstore');
                                                var linkClass = 'pt-banner-item__link--appstore';
                                        }
                                        if (item.itarget.google_play) {
                                                element.classList.add('pt-banner-item--gplay');
                                                var linkClass = 'pt-banner-item__link--gplay';
                                        } else {
                                                element.classList.add('pt-banner-item--gplay');
                                                var linkClass = 'pt-banner-item__link--gplay';
                                        }

                                        content.push('<a href="' + CORE.URL_BUILDER.builder.createTrackingUrl(request) + '" target="_blank" class="pt-banner-item__link ' + linkClass + '"></a>');
                                        */
                                        content.push('</div>');//close 5

                                        element.classList.add('pt-banner-item__row_click');
                                }
                                else {
                                        subscribe = [
                                                '<div class="pt-banner-item__content">',//open 4
                                                        '<div class="pt-banner-subscribe pt-banner-subscribe--start">',//open 5
                                                                '<button type="button" class="pt-banner-item__link pt-banner-item__link--subscribe"></button>',
                                                        '</div>',//close 5
                                                        '<div class="pt-banner-subscribe pt-banner-subscribe--form">',//open 6
                                                                '<div class="pt-banner-subscribe__field-wrapper"><input type="email" class="pt-banner-subscribe__field" placeholder="ваш e-mail"></div>',//open -close 7
                                                                '<div class="pt-banner-subscribe__button-wrapper"><button type="button" class="pt-banner-subscribe__button pt-banner-subscribe__button--disabled">OK</button></div>',//open -close 8
                                                                '<div class="pt-banner-subscribe__agree">',//open 9
                                                                        '<input type="checkbox" class="pt-banner-subscribe__agree-checkbox" id="presstake-banner-app-subscribe-' + item.id + '" />',
                                                                        '<label for="presstake-banner-app-subscribe-' + item.id + '" class="pt-banner-subscribe__agree-label">',
                                                                                'Я согласен с ',
                                                                                '<a href="#"  rel="nofollow" target="_blank" class="pt-banner-subscribe__agree-link">условиями</a>',
                                                                        '</label>',
                                                                '</div>',//close 9
                                                        '</div>',//close 6
                                                        '<div class="pt-banner-subscribe pt-banner-subscribe--done">',//open 10
                                                                '<button type="button" class="pt-banner-item__link pt-banner-item__link--subscribe-done"></button>',
                                                        '</div>',//close 10
                                                '</div>'//close 4
                                        ];
                                        content = content.concat(subscribe);
                                        element.classList.add('pt-banner-item--subscribe-offer');

                                        content.push('</div>');// close 2
                                }

                                return content;
                            },
                            addRecommendedTitle : function () {
                                var element = document.createElement('div'),
                                        content = [
                                                    '<div class="pt-banner-item__rec pt-banner-item__rec--text">',
                                                            'Рекомендуемые',
                                                    '</div>',
                                                ];

                                element.classList.add('pt-banner-item');
                                element.classList.add('pt-banner-item-rec');
                                element.classList.add('pt-banner-item-rec-title');

                                element.innerHTML = content.join('');

                                list.appendChild(element);
                            }
                     }
                 }
            }
        }

        SYSTEM.BANNER.createBaseHTML();

        banner  		= document.getElementById(banner_id);
        banner_cl 		= banner.classList;
        list    		= banner.querySelector('.pt-banner-list');
        classes 		= 	{
                    banner_has_data:'pt-banner--has-data',
                    banner_hidden: 	'pt-banner--hidden',
                    banner_scroll: 	'pt-banner--scroll-enough',
                    list_open: 		'pt-banner--list-open'
            };

	//обработчики событий
        SYSTEM.BANNER.initListeners();
	//загрузка данных
        SYSTEM.BANNER.LIST.loadAppsList();

        if(core.COMMON.debug.isActive()) {
            core.COMMON.debug.container.OPERATION_SYSTEM = SYSTEM;
        }
	//внешнее "api" для владельцев сайтов-партнеров, если им при определенных условиях нужно будет
	//открывать/закрывать список приложений или сам баннер, они смогут сделать это, например, с помощью PRESSTAKE_BANNER.openList();
	return {
		openBanner: 	SYSTEM.BANNER.openBanner,
		closeBanner: 	SYSTEM.BANNER.closeBanner,
		openList: 	SYSTEM.BANNER.LIST.openList,
		closeList: 	SYSTEM.BANNER.LIST.closeList
	};

})(PRESSTAKE_BANNER_CORE);
