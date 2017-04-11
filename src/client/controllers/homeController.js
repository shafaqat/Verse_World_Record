var app = angular.module('app');

app.controller('homeController', function($scope, $interval, $rootScope, $window, $document, $timeout, $location, stanzaService) {

    $scope.tab = "published";
    $scope.currentPage = 0;
    $scope.stanza_text;
    $scope.submitter_name;
    $scope.submitter_n_id;
    $scope.twitter_account;
    $scope.mobile_number;


    var window = angular.element($window);

    function errorhandler(error) {
        console.log('error:', error);
    }

    $scope.submitStanza = function() {

        var stanza = {
            'stanza_text': $scope.stanza_text,
            'submitter_name': $scope.submitter_name,
            'submitter_n_id': $scope.submitter_n_id,
            'twitter_account': $scope.twitter_account,
            'mobile_number': $scope.mobile_number
        };

        stanzaService.submitStanza(stanza).then(
            function(response) {

                if (response.status === 'failure')
                    $rootScope.server_message = gettext(response.errormessage);
                else {
                    $rootScope.server_message = gettext(response.submitMessage);
                    $location.path('/');
                }
                $rootScope.hide_message_banner = false;



                $timeout(function() {
                    $rootScope.hide_message_banner = true;
                }, $scope.server_message_hide_delay);

            },
            errorhandler
        );
    };

    var checkForScriptLoad = $interval(function() {
            if ($scope.isDirectiveLoaded) {
                $interval.cancel(checkForScriptLoad);

                $scope.route_change_render_ejs($scope);
                $scope.timerFunc();
            }
        },
        100);

    $scope.getStanzas($scope.tab, "");
});