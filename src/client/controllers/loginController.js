var app = angular.module('app');

app.controller('loginController', function($scope, $location, $timeout, UserService) {

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
            $scope.$parent.server_message = gettext(payload);
            $scope.$parent.hide_message_banner = false;
            $scope.$parent.isJudgeLogin = true;

            $scope.setJudgeInfo();

            $timeout(function() {
                $scope.$parent.hide_message_banner = true;
            }, $scope.server_message_hide_delay);
        });

    };

    $scope.signup = function() {
        UserService.signUp($scope.userEmail, $scope.userPassword);
    };

    $scope.forgotPassword = function() {
        UserService.forgotPassword($scope.userEmail).then(
            function(payload) {
                $scope.$parent.server_message = gettext(payload);
                $scope.$parent.hide_message_banner = false;

                $timeout(function() {
                    $scope.$parent.hide_message_banner = true;
                }, $scope.server_message_hide_delay);
            }
        );
    };

    $scope.resetPassword = function() {
        if ($scope.userPassword != $scope.confirmUserPassword) {
            $scope.$parent.server_message = gettext("Passwords do not match");
            $scope.$parent.hide_message_banner = false;

            $timeout(function() {
                $scope.$parent.hide_message_banner = true;
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
                        $scope.$parent.server_message = gettext('password changed successfully');
                    } else if (!data.updateStatus) {
                        $scope.updateStatus = true;
                        $scope.$parent.server_message = gettext('reset failed');
                    }
                    $scope.$parent.hide_message_banner = false;


                    $timeout(function() {
                        $scope.$parent.hide_message_banner = true;
                    }, $scope.server_message_hide_delay);
                }, errorhandler
            );
    };
    $scope.route_change_render_ejs($scope);
});