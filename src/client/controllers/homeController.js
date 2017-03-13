var app = angular.module('app');

app.controller('homeController', function($scope, $window, $document, $timeout, stanzaService) {

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
                $scope.$parent.server_message = results.submitMessage;
                $scope.$parent.hide_message_banner = false;

                $timeout(function() {
                    $scope.$parent.hide_message_banner = true;
                }, $scope.server_message_hide_delay);

            },
            errorhandler
        );
    };

    if ($scope.$parent.no_of_submissions === 0) {
        $scope.getStanzas('published');
    }

    $scope.route_change_render_ejs($scope);
    $scope.timerFunc();
    angular.element("#stanza_text_area").arabisk();
});