var app = angular.module('app');

app.factory('authService', function($http, $location, $q) {
    var judgeType = null;
    var logInStatus = false;
    var deferred = null;

    function successHandler(res) {
        logInStatus = res.data.LogIn.status;
        judgeType = res.data.LogIn.type;
        var obj = {
            judgeType: judgeType,
            logInStatus: logInStatus
        };
        deferred.resolve(obj);
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
            return deferred.promise;
        },
        setLogInStatus: function(status) {
            logInStatus = status;
        }
    };
});