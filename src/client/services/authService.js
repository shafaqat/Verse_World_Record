var app = angular.module('app');

app.factory('authService', function($http, $location, $q) {

    var deferred = null;
    var judge = {
        judgeType: null,
        logInStatus: null
    };

    function successHandler(res) {
        judge.logInStatus = res.data.LogIn.status;
        judge.judgeType = res.data.LogIn.type;

        deferred.resolve(judge);
    }

    function showError(err) {
        console.log('error:', error);
    }

    return {
        checkLogIn: function() {
            deferred = $q.defer();
            $http.get('/logInStatus').then(successHandler, showError);

            return deferred.promise;
        },
        checkJudgeType: function() {
            deferred = $q.defer();
            this.checkLogIn().then(function(judge) {
                deferred.resolve(judge);
            });
            return deferred.promise;
        },
        setLogInStatus: function(status) {
            judge.logInStatus = status;
        }
    };
});