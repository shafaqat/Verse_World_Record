'use strict';

var app = angular.module('app');

app.controller('panelController', function($scope, $rootScope, $document, $timeout, $location, stanzaService, UserService) {

    $scope.tab = 'pending approval';
    $scope.edit_stanza_id = '';
    $scope.edit_stanza_text = '';
    $scope.p_stanza = null;

    function errorhandler(error) {
        console.log('Error: ', error);
    }

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        $scope.search_query = "";
        $scope.search_close_btn = false;
        $scope.getStanzas($scope.tab, "");
    };

    $scope.set_edit_stanza_vars = function(index) {
        $scope.hide_message_banner = true;
        $scope.edit_stanza_index = index;
        $scope.p_stanza = angular.element('.p_stanza:nth-child(' + (index + 1) + ')');
        $scope.p_stanza.find('textarea').arabisk();

        console.log($scope.p_stanza.html());
        console.log($scope.p_stanza.scope());

        if ($scope.tab.includes('pending')) $scope.edit_stanza_text = $scope.pending_stanzas[index].stanza_text;
        else $scope.edit_stanza_text = $scope.approved_stanzas[index].stanza_text;
    };

    $scope.update_stanza = function(update_behavior, stanza_id, index, stanza_text) {
        $scope.hide_message_banner = true;
        if ($scope.tab == 'approved') $scope.current_stanzas = $scope.approved_stanzas;
        else $scope.current_stanzas = $scope.pending_stanzas;

        if ($scope.edit_stanza_index !== index) stanza_text = $scope.current_stanzas[index].stanza_text;
        else {
            stanza_id = $scope.current_stanzas[index].id;
        }
        stanzaService.updateStanza(update_behavior, stanza_id, stanza_text).then(function(updated) {
            if (updated) {
                if (update_behavior == 'approved') {
                    $scope.stanzas_to_add = $scope.approved_stanzas;
                } else if (update_behavior == 'rejected') {
                    $scope.stanzas_to_add = $scope.rejected_stanzas;
                } else if (update_behavior == 'pending approval') {
                    update_behavior = 'updated';
                    $scope.current_stanzas[index].stanza_text = stanza_text;

                    $scope.p_stanza.scope().show_edit_area = false;
                    console.log($scope.p_stanza.scope());
                } else if (update_behavior == 'published') {
                    $scope.stanzas_to_add = $scope.published_stanzas;
                }

                $scope.server_message = gettext('The stanza is ' + update_behavior);
                $scope.hide_message_banner = false;

                $timeout(function() {
                    $scope.hide_message_banner = true;
                }, $scope.server_message_hide_delay);

                if (update_behavior != 'updated') {
                    // $scope.stanzas_to_add.splice(0, 0, $scope.current_stanzas[index]);

                    if (update_behavior == 'published')
                        $scope.approved_stanzas.splice(index, 1);
                    else {
                        $scope.drafts_count--;
                        $scope.current_stanzas.splice(index, 1);
                    }

                    $rootScope.no_of_submissions--;
                }

                $scope.edit_stanza_index = null;
                $scope.edit_stanza_text = null;
            }
        }, errorhandler);
    };

    $scope.search_in_stanzas = function() {
        $scope.search_close_btn = true;
        $scope.getStanzas($scope.tab, $scope.search_query);
    };

    $scope.reset_search_in_stanzas = function() {
        $scope.search_query = "";
        $scope.search_close_btn = false;
        $scope.getStanzas($scope.tab, "");
    };
    $scope.getStanzas($scope.tab, "", $scope);
    $scope.route_change_render_ejs($scope);
});