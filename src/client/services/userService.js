var app = angular.module('app');

app.factory('UserService', function($http, authService, $location, $q) {
    var deferred;
    var logout = false;

    function successhandler(response) {
        var data = response.data;
        var isloggedIn = data.isloggedIn;

        if (isloggedIn) {
            authService.setLogInStatus(!logout);
            $location.path('/panel');
        } else if (!isloggedIn && logout) {
            logout = false;
            $location.path('/login');
        } else
            deferred.resolve('login failed');

    }


    function errorhandler(error) {
        console.log('Error: ', error);
    }

    return {
        logIn: function(userEmail, userPassword) {
            deferred = $q.defer();
            var user = {
                'userEmail': userEmail,
                'userPassword': userPassword
            };

            $http.post('login/validate', user).then(successhandler, errorhandler);

            return deferred.promise;
        },

        logOut: function() {
            deferred = $q.defer();

            $http.post('logout').then(function(result) {
                logout = true;
                deferred.resolve(false);
                authService.setLogInStatus(!logout);
                $location.path('/login');
            }, errorhandler);

            return deferred.promise;
        },

        signUp: function(userEmail, userPassword) {

            var user = {
                'userEmail': userEmail,
                'userPassword': userPassword
            };

            $http.post('signup', user).then(function(response) {
                var reset_password_message = (response.data.signup) ? 'signup successfull' : 'User already exists';
                // bootbox.alert(reset_password_message);
            }, errorhandler);

        },

        forgotPassword: function(userEmail) {
            deferred = $q.defer();
            var user = {
                'userEmail': userEmail,
            };

            $http.post('forgot-password', user).then(function(response) {
                if (response.data.status == 'ok') {
                    deferred.resolve('url sent');
                    console.log('url:', response.data.url);
                }
            }, errorhandler);
            return deferred.promise;
        },

        resetPassword: function(user) {
            deferred = $q.defer();
            $http.post('/reset', user).then(function(response) {
                var data = response.data;
                deferred.resolve(data);
            }, errorhandler);

            return deferred.promise;
        }
    };
});