var app = angular.module('app');

app.controller('homeController', function($scope, $rootScope, $window, $document, $timeout, $location, stanzaService) {

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
            function(results) {
                $rootScope.server_message = gettext(results.submitMessage);
                $rootScope.hide_message_banner = false;

                $location.path('/');
                $timeout(function() {
                    $rootScope.hide_message_banner = true;
                }, $scope.server_message_hide_delay);

            },
            errorhandler
        );
    };



    $scope.getStanzas($scope.tab, "");
    $scope.route_change_render_ejs($scope);
    $scope.timerFunc();
});