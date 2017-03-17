var app = angular.module('app');

app.factory('stanzaService', function($http, $q) {
    var deferred;

    function successhandler(response) {
        deferred.resolve(response.data);
        console.log('stanza', response.data);

    };

    function errorhandler(error) {
        console.log('Error: ', error);
    };

    return {
        getStanzas: function(stanza_status, currentPage, search_query) {
            deferred = $q.defer();

            $http.get('stanza/get/' + stanza_status + '/' + currentPage + '/' + search_query).then(successhandler, errorhandler);

            return deferred.promise;
        },
        submitStanza: function(stanza) {
            deferred = $q.defer();

            $http.post('stanza/create/', stanza).then(successhandler, errorhandler);
            return deferred.promise;
        },
        updateStanza: function(update_behavior, stanza_id, stanza_text) {
            deferred = $q.defer();

            var options = {
                update_behavior: update_behavior,
                stanza_id: stanza_id,
                stanza_text: stanza_text
            };

            $http.post('stanza/update/', options).then(successhandler, errorhandler);

            return deferred.promise;
        }
    }
});