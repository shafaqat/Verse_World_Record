var app = angular.module('app', ['ngRoute', 'ngMessages']);
var locale;
var scope;
var changeLocale;

function gettext(key) {
    if (!locale[key])
        return "";
    return locale[key][1];
};


app.controller('appController', function($scope, $document, $route, $compile, $window, $timeout, authService, UserService, stanzaService, localizationService, fileReaderService) {
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
    $scope.search_stanzas = [];
    $scope.search_stanzas_page = { level: 0 };

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


    var ng_view_template;
    var ng_view_child_scope;

    var header_file_path = "../views/tempates/header.html";



    localizationService.getchangedLocale($scope.lang).then(
        function(result) {
            $scope.locale = result.messages;
            locale = $scope.locale;

        }
    );

    var nav_header_template = '<header class="navigation"><nav class="navbar navbar-default" ng-class="{header_on_scroll: boolChangeHeaderClass}"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#verseTopNav" aria-expanded="false"><span class="sr-only"><%= gettext("Toggle navigation") %></span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class=" navbar-brand" href="/"><%= gettext("Website title") %></a></div><div class="collapse navbar-collapse"><ul id="verseTopNav" class="nav navbar-nav navbar-right main-menu navbar-collapse collapse breadcrumbs"><li ng-if="!location.includes(\'home\')" ng-class="{active: location.includes(\'home\')}"><a href="/"><%= gettext("HOME") %></a></li><li ng-if="location.includes(\'home\') && isJudgeLogin" ng-class="{active: location.includes(\'panel\')}"><a href="/panel"><%= gettext("PANEL") %></a></li><li ng-if=""><a href="#" class="nav-separator">|</a></li><li ng-if="!isJudgeLogin && !location.includes(\'login\')" ng-class="{active: location.includes(\'login\')}"><a href="/login"><%= gettext("LOGIN") %></a></li><li ng-click="logout()" ng-show="isJudgeLogin"><a href="#"><%= gettext("LOGOUT") %></a></li><li><a href="#" class="nav-separator">|</a></li><li><select name="countries" id="countries" style="margin-top:8%;width:110%; border:none;" onchange="changeLocale(value)"><option value="ar" data-image="public/libs/msdropdown/blank.gif" data-imagecss="flag sa" ><%= gettext("U.A.E") %></option><option value="en" data-image="public/libs/msdropdown/blank.gif" data-imagecss="flag us"><%= gettext("US") %></option></select></li></ul></div></div></nav></header><div class="clearfix scroll-div" ng-if="location.includes(\'home\') || location.includes(\'panel\')" ng-show="boolShowStaticHeader"><div class="col-xs-1 division"><a class=" navbar-brand" href="/"><%= gettext("Website title") %></a></div><div class="col-xs-4 division-tabs"><div ng-hide=\'!location.includes("panel")\'><div class="collapse navbar-collapse"><ul class="nav navbar-nav"><li ng-class="{active: tab == \'pending approval\'}" ng-click="changeTab(\'pending approval\')"><a href="#"><%= gettext("Draft") %> (09)<span class="sr-only">(<%= gettext("current") %></span></a></li><li ng-class="{active: tab == \'approved\'}" ng-click="changeTab(\'approved\')"><a href="#"><%= gettext("Pending") %></a></li><li ng-class="{active: tab == \'rejected\'}" ng-click="changeTab(\'rejected\')"><a href="#"><%= gettext("Rejected") %></a></li><li ng-class="{active: tab == \'published\'}" ng-click="changeTab(\'published\')"><a href="#"><%= gettext("Published") %></a></li></ul></div></div></div><div class="col-xs-4 division-dots"><div class="panel-container"><div class="clearfix slider"><div class="col-xs-12 text-center"><div id="myCarousel" class="carousel slide" data-ride="carousel"><div class="carousel"><ol class="carousel-indicators"><li class="next-prev-icon" ng-click="get_stanzas_from_navigation($event, \'pre\')"><i class="fa fa-angle-left"></i></li><% for(var i=0; i < no_of_submissions; i+=50) { %><li class="nav-dots" ng-class="{active:(current_page.level*50) == <%= i%>}" ng-click="get_stanzas_from_navigation($event,  <%= i%>)" class="top" title="" data-placement="left" data-toggle="tooltip" href="#" data-original-title="{{(<%= i%>).toLocaleString(lang)}} - {{(<%= i%>+50).toLocaleString(lang)}}"></li><% } %><li class="next-prev-icon" ng-click="get_stanzas_from_navigation($event, \'next\')"><i class="fa fa-angle-right"></i></li></ol></div></div></div></div></div></div><div class="col-xs-3 text-center" ng-hide=\'!location.includes("home")\'><a href="/submit"><button type="button" class="btn-home-sticky"><%= gettext("SUBMIT NOW") %></button></a></div></div>';

    $scope.route_change_render_ejs = function(child_scope) {
        $timeout(function() {
            ng_view_child_scope = child_scope;

            var ng_view = angular.element('#ngView');
            ng_view_template = ng_view.html();
            var html = ejs.render(nav_header_template + ng_view_template, { no_of_submissions: $scope.no_of_submissions });

            html.replace(/<script>/g, '<div>')
                .replace(/<\/script>/g, '</div>');
            ng_view.parent().html($compile(html)(child_scope));

            angular.element('#ng_view_container').find('#countries').val($scope.lang);
            $('[data-toggle="tooltip"]').tooltip();
            angular.element("#search-input").arabisk();
            $("#countries").msDropdown();
            $scope.timerFunc();
        }, 150);


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
                var html = ejs.render(template, { no_of_submissions: $scope.no_of_submissions });
                html = $compile(html)(ng_view_child_scope);
                ng_view.html(html);

                ng_view.find('#countries').val(lang);
                $("#countries").msDropdown();

                $('[data-toggle="tooltip"]').tooltip();
                if (ng_view.find("#stanza_text_area").val()) {
                    angular.element("#stanza_text_area").arabisk();
                    angular.element("#search-input").arabisk();
                }
                $scope.timerFunc();
            });
    };

    changeLocale = $scope.changeLocale;

    $scope.timerFunc = function() {
        var endDate = "March 18, 2017 00:00:00";
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


    $scope.getStanzas = function(stanza_status, search_query) {
        $scope.tab = stanza_status;

        if ($scope.tab == 'search') {
            $scope.current_page = $scope.search_stanzas_page;
            $scope.current_stanzas = $scope.search_stanzas;
        } else if (stanza_status == 'published') {
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

        stanzaService.getStanzas(stanza_status, $scope.current_page.level, search_query)
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
            $scope.current_page.level = ($scope.current_page.level > 0) ? ($scope.current_page.level - 1) : $scope.current_page.level;
        } else if (page == 'next') {
            $scope.current_page.level = (($scope.no_of_submissions > 50) && ($scope.no_of_submissions > ($scope.current_page.level * 50 + 50))) ? ($scope.current_page.level + 1) : $scope.current_page.level;
        } else
            $scope.current_page.level = page / 50;

        if (($scope.no_of_submissions > 50) && (($scope.current_page.level * 50) < $scope.no_of_submissions)) {
            $scope.getStanzas($scope.tab, "");
        }
    };

    $scope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $scope.location = nextRoute.originalPath;
        $scope.setJudgeInfo();

    });

    angular.element($window).bind("scroll", function() {
        if (this.pageYOffset >= 200) {
            $scope.boolShowStaticHeader = true;
        } else {
            $scope.boolShowStaticHeader = false;
        }
        scope.$apply();
    });
});