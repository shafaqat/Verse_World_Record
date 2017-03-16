var app = angular.module('app');

app.factory('localizationService', function($http, $q) {
    var deferred;

    function successhandler(response) {
        deferred.resolve(response.data);
    }

    function errorhandler(error) {
        console.log('Error: ', error);
    };

    return {
        getchangedLocale: function(lang) {
            deferred = $q.defer();
            console.log('lang:', lang);
            $http.get('/locale/' + lang).then(successhandler, errorhandler);

            return deferred.promise;
        }
    };
});