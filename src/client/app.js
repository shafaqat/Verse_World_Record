var app = angular.module('app', ['ngRoute', 'ngMessages']);
var locale;
var scope;
var changeLocale;

function gettext(key) {
    if (!locale[key])
        return "";
    return locale[key][1];
};


app.controller('appController', function($scope, $document, $route, $compile, $window, $timeout, authService, UserService, stanzaService, localizationService) {
    $scope.location = '';
    $scope.server_message = '';
    $scope.tab = 'published';
    $scope.server_message_hide_delay = 3000;
    $scope.hide_message_banner = true;
    $scope.current_page = null;
    $scope.current_stanzas = null;
    $scope.isChiefJudge = false;
    $scope.isJudgeLogin = false;
    $scope.submissions_closed = false;
    console.log('app', $scope);

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



    localizationService.getchangedLocale($scope.lang).then(
        function(result) {
            $scope.locale = result.messages;
            locale = $scope.locale;

        }
    );

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