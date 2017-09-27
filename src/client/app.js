'use strict';

var app = angular.module('app', ['ngRoute', 'ngMessages']);
var locale;
var scope;
var changeLocale;

function gettext(key) {
    if (locale == undefined || !locale[key]) return "";
    return locale[key][1];
};

app.controller('appController', function($scope, $rootScope, $document, $route, $compile, $window, $timeout, authService, UserService, stanzaService, localizationService) {
    $rootScope.server_message = '';
    $rootScope.hide_message_banner = true;
    $rootScope.no_of_submissions = 0;

    $scope.isDirectiveLoaded = false;

    $scope.location = '';
    $scope.tab = 'published';
    $scope.server_message_hide_delay = 6000;
    $scope.current_page = null;
    $scope.current_stanzas = null;
    $scope.isChiefJudge = false;
    $scope.isJudgeLogin = false;
    $rootScope.submissions_closed = false;
    $scope.submissions_closed_date = "December 28, 2017 00:00:00";

    $scope.published_stanzas = [];
    $scope.published_stanzas_page = { level: 0 };
    $scope.pending_stanzas = [];
    $scope.pending_stanzas_page = { level: 0 };
    $scope.approved_stanzas = [];
    $scope.approved_stanzas_page = { level: 0 };
    $scope.rejected_stanzas = [];
    $scope.rejected_stanzas_page = { level: 0 };

    $scope.drafts_count = 0;
    $scope.pagination_level = 0;

    $scope.lang = $window.localStorage.getItem('lang') || 'ar';

    authService.checkLogIn().then(function(payload) {
        $scope.isJudgeLogin = payload.logInStatus;
    });

    scope = $scope;
    $scope.reset_message_banner = function() {
        $rootScope.server_message = '';
        $rootScope.hide_message_banner = true;
    }
    $scope.setJudgeInfo = function() {
        authService.checkJudgeType().then(function(userInfo) {
            $scope.isJudgeLogin = userInfo.logInStatus;
            $scope.isChiefJudge = userInfo.judgeType == 'head' ? true : false;
        });
    };

    $scope.logout = function() {
        UserService.logOut().then(function(result) {
            $scope.isJudgeLogin = false;
        });
    };

    $scope.getStanzas = function(stanza_status, search_query) {
        $scope.tab = stanza_status;
        $scope.show_loading_spinner = true;

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

        stanzaService.getStanzas(stanza_status, $scope.current_page.level, search_query)
            .then(function(result) {
                $rootScope.no_of_submissions = result[result.length - 1];
                result.splice(result.length - 1, 1);

                if (stanza_status == 'pending approval' && search_query == "") {
                    $scope.drafts_count = angular.copy($scope.no_of_submissions);
                }

                $scope.current_stanzas.length = 0;
                result.forEach(function(item) {
                    $scope.current_stanzas.push(item);
                });
                $scope.show_loading_spinner = false;
            }, function(error) {
                $scope.show_loading_spinner = false;
            });
    };

    $scope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
        $scope.location = nextRoute.originalPath;
        $scope.setJudgeInfo();
    });
});
