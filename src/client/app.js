var app = angular.module('app', ['ngRoute', 'ngMessages']);
var locale;
var scope;
var changeLocale;

function gettext(key) {
    console.log('key: ', key);
    if (!locale[key])
        return "";
    return locale[key][1];
};


app.controller('appController', function($scope, $document, $route, $compile, $window,
    authService, UserService, stanzaService, localizationService) {

    $scope.location = '';
    $scope.server_message = '';
    $scope.tab = 'published';
    $scope.server_message_hide_delay = 3000;
    $scope.hide_message_banner = true;
    $scope.current_page = null;
    $scope.current_stanzas = null;
    $scope.isChiefJudge = false;
    $scope.isJudgeLogin = false;

    $scope.published_stanzas = [];
    $scope.published_stanzas_page = { level: 0 };
    $scope.pending_stanzas = [];
    $scope.pending_stanzas_page = { level: 0 };
    $scope.approved_stanzas = [];
    $scope.approved_stanzas_page = { level: 0 };
    $scope.rejected_stanzas = [];
    $scope.rejected_stanzas_page = { level: 0 };

    $scope.no_of_submissions = 0;
    $scope.pagination_level = 0;

    $scope.lang = $window.localStorage.getItem('lang') || 'ar';

    authService.checkLogIn().then(function(payload) {
        $scope.isJudgeLogin = payload.logInStatus;
    });


    scope = $scope;
    $scope.setJudgeInfo = function() {
        authService.checkJudgeType().then(
            function(userInfo) {
                $scope.isJudgeLogin = userInfo.logInStatus;
                $scope.isChiefJudge = (userInfo.judgeType == 'head') ? true : false;
            }
        );

    };

    $scope.logout = function() {
        UserService.logOut().then(function(result) {
            $scope.isJudgeLogin = false;
        });
    };

    localizationService.getchangedLocale($scope.lang).then(
        function(result) {
            $scope.locale = result.messages;
            locale = $scope.locale;
            console.log('localization: ', result.messages);
        }
    );


    var ng_view_template;
    var ng_view_child_scope;
    var nav_header_template = "<header class='navigation'> <nav class = 'navbar navbar-default  navbar-fixed-top' ><div class = 'container-fluid' ><div class = 'navbar-header' ><button type = 'button' class = 'navbar-toggle collapsed' data-toggle ='collapse' data-target = '#verseTopNav' aria-expanded = 'false' > <span class = 'sr-only' > <%= gettext('Toggle navigation') %> </span> <span class = 'icon-bar' > </span> <span class = 'icon-bar' > </span> <span class =  'icon-bar' > </span> </button> <a class = 'navbar-brand' href = '#' > <%= gettext('Website title') %> </a> </div > <ul id='verseTopNav' class = 'nav navbar-nav navbar-right main-menu navbar-collapse collapse' > <li ng-class='{active: location.includes(\"home\")}' > <a href = '/' ><%= gettext(\"HOME\") %> </a> </li > <li > <a href = '#' class=\"nav-separator\"> | </a></li ><li ng-show = '!isJudgeLogin' ng-class = '{active: location.includes(\"login\")}' ><a href = '/login' ><%= gettext('LOGIN') %> </a> </li > <li ng-click = 'logout()' ng-show = 'isJudgeLogin' > <a href = '#' ><%= gettext('LOGOUT') %> </a> </li >  <li><a href=\"#\" class=\" nav-separator \">|</a></li><li > <select name=\"countries \" id=\"countries \" style=\" margin-top: 8%; width: 110%;border: none;\" onchange=\"changeLocale(value)\"> <option value = 'ar' data-image = \"public/libs/msdropdown/blank.gif \" data-imagecss = \"flag ae\" data-title =\"United Arab Emirates\" > <%= gettext('U.A.E') %> < /option> <option value = 'en' data-image =\"public/libs/msdropdown/blank.gif\" data-imagecss = \"flag us\" data-title = \"United States\" > <%= gettext('US') %> </option> </select > </li > </ul > </div > </nav > </header > ";

    $scope.route_change_render_ejs = function(child_scope) {
        angular.element(document).ready(function() {
            ng_view_child_scope = child_scope;
            var ng_view = angular.element('#ngView');

            ng_view_template = ng_view.html();
            nav_header_template = angular.element('#navigation_header').html();
            var html = ejs.render(nav_header_template + ng_view_template, $scope.locale);

            html.replace(/<script>/g, '<div>')
                .replace(/<\/script>/g, '</div>');
            ng_view.parent().html($compile(html)(child_scope));

            angular.element('#ng_view_container').find('#countries').val($scope.lang);

            $('[data-toggle="tooltip"]').tooltip();
            $("#countries").msDropdown();
        });
    };

    $scope.changeLocale = function(lang) {
        $window.localStorage.setItem('lang', lang);
        $scope.lang = lang;
        localizationService.getchangedLocale(lang).then(
            function(result) {
                $scope.locale = result.messages;
                locale = $scope.locale;
                var ng_view = angular.element('#ng_view_container');
                var template = nav_header_template + ng_view_template;
                var html = ejs.render(template, $scope.locale);

                html = $compile(html)(ng_view_child_scope);
                ng_view.html(html);

                ng_view.find('#countries').val(lang);
                $("#countries").msDropdown();
                $('[data-toggle="tooltip"]').tooltip();
                angular.element("#stanza_text_area").arabisk();
                $scope.timerFunc();
            });
    };
    changeLocale = $scope.changeLocale;

    $scope.timerFunc = function() {
        var endDate = "March 16, 2017 00:00:00";
        $('.countdown.styled').countdown({
            date: endDate,
            render: function(data) {
                $(this.el).html(
                    "<div>" + parseInt(this.leadingZeros(data.days, 2)).toLocaleString($scope.lang) +
                    "<p>:</p> <span>days</span></div><div>" +
                    parseInt(this.leadingZeros(data.hours, 2)).toLocaleString($scope.lang) +
                    "<p>:</p> <span>hrs</span></div><div>" +
                    parseInt(this.leadingZeros(data.min, 2)).toLocaleString($scope.lang) +
                    "<p>:</p> <span>min</span></div><div>" +
                    parseInt(this.leadingZeros(data.sec, 2)).toLocaleString($scope.lang) + " <span>sec</span></div>");
            }
        });
    };


    $scope.getStanzas = function(stanza_status) {
        $scope.tab = stanza_status;

        if (stanza_status == 'published') {
            $scope.current_page = $scope.published_stanzas_page;
            $scope.current_stanzas = $scope.published_stanzas;
        } else if (stanza_status == 'pending approval') {
            $scope.current_page = $scope.pending_stanzas_page;
            $scope.current_stanzas = $scope.pending_stanzas;
        } else if (stanza_status == 'approved') {
            $scope.current_page = $scope.approved_stanzas_page;
            $scope.current_stanzas = $scope.approved_stanzas;
        } else if (stanza_status == 'rejected') {
            $scope.current_page = $scope.rejected_stanzas_page;
            $scope.current_stanzas = $scope.rejected_stanzas;
        }

        stanzaService.getStanzas(stanza_status, $scope.current_page.level)
            .then(
                function(result) {

                    $scope.no_of_submissions = result[result.length - 1][0]['COUNT(*)'];
                    result.splice(result.length - 1, 1);

                    $scope.current_stanzas.length = 0;
                    result.forEach(function(item) {
                        $scope.current_stanzas.push(item);
                    });
                },
                function(error) {}
            );

    };

    $scope.get_stanzas_from_navigation = function(event, page) {
        if (page == 'pre') {
            $scope.current_page.level = ($scope.current_page.level > 1) ? ($scope.current_page.level - 1) : 0;

            if ($scope.current_page.level > 0 && (($scope.current_page.level + 1) * 50) % 500 == 0)
                $scope.pagination_level -= 10;

        } else if (page == 'next') {
            $scope.current_page.level = (($scope.no_of_submissions > 50) && ($scope.no_of_submissions > ($scope.current_page.level * 50 + 50))) ?
                ($scope.current_page.level + 1) : ($scope.current_page.level);

            if (($scope.no_of_submissions > 50) && ($scope.current_page.level * 50 % 500 === 0))
                $scope.pagination_level += 10;
        } else if (($scope.no_of_submissions) >= (page * 50 + 1))
            $scope.current_page.level = page;

        if (($scope.no_of_submissions > 50) && (($scope.current_page.level * 50) < $scope.no_of_submissions)) {
            $scope.getStanzas($scope.tab);
        }
    };

    $scope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $scope.location = nextRoute.originalPath;
        $scope.setJudgeInfo();
    });
});