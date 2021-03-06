var app = angular.module('app');

app.controller('loginController', function($scope, $interval, $rootScope, $location, $timeout, UserService) {

    $scope.userEmail = '';
    $scope.userPassword = '';
    $scope.confirmUserPassword = '';
    $scope.token = '';

    $scope.reset_password_message = '';
    $scope.updateStatus = false;

    function errorhandler(error) {
        console.log('err.message:', err.message);
    }

    $scope.login = function() {
        UserService.logIn($scope.userEmail, $scope.userPassword).then(function(payload) {
            $rootScope.server_message = gettext(payload);
            $rootScope.hide_message_banner = false;
            if (payload != "login failed")
                $scope.$parent.isJudgeLogin = true;

            $scope.setJudgeInfo();

            $timeout(function() {
                $rootScope.hide_message_banner = true;
            }, $scope.server_message_hide_delay);
        });

    };

    $scope.signup = function() {
        UserService.signUp($scope.userEmail, $scope.userPassword);
    };

    $scope.forgotPassword = function() {
        $scope.show_loading_spinner = true;
        UserService.forgotPassword($scope.userEmail).then(
            function(payload) {
                $rootScope.server_message = gettext(payload);
                $rootScope.hide_message_banner = false;
                $scope.show_loading_spinner = false;

                if (payload === 'url sent')
                    $location.path('/login');
                $timeout(function() {
                    $rootScope.hide_message_banner = true;
                }, $scope.server_message_hide_delay);
            }
        );
    };

    $scope.resetPassword = function() {
        if ($scope.userPassword != $scope.confirmUserPassword) {
            $rootScope.server_message = gettext("Passwords do not match");
            $rootScope.hide_message_banner = false;

            $timeout(function() {
                $rootScope.hide_message_banner = true;
            }, $scope.server_message_hide_delay);
            return;
        }

        var user = {
            'token': $scope.token,
            'userPassword': $scope.userPassword
        };

        UserService.resetPassword(user)
            .then(
                function(data) {
                    if (data.updateStatus) {
                        $scope.updateStatus = true;
                        $rootScope.server_message = gettext('password changed successfully');
                    } else if (!data.updateStatus) {
                        $scope.updateStatus = true;
                        $rootScope.server_message = gettext('reset failed');
                    }
                    $rootScope.hide_message_banner = false;


                    $timeout(function() {
                        $rootScope.hide_message_banner = true;
                    }, $scope.server_message_hide_delay);
                }, errorhandler
            );
    };

    var checkForScriptLoad = $interval(function() {
            if ($scope.isDirectiveLoaded) {
                $interval.cancel(checkForScriptLoad);

                $scope.route_change_render_ejs($scope);
            }
        },
        100);
});