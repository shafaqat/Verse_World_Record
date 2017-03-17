var app = angular.module('app');

app.controller('panelController', function($scope, $window, $document, $timeout, $location, stanzaService, UserService) {

    $scope.tab = 'pending approval';
    $scope.edit_stanza_id = '';
    $scope.edit_stanza_text = '';
    $scope.p_stanza = null;
    var window = angular.element($window);


    function errorhandler(error) {
        console.log('Error: ', error);
    }

    $scope.set_edit_stanza_vars = function(index) {
        $scope.$parent.hide_message_banner = true;
        $scope.edit_stanza_index = index;
        $scope.p_stanza = angular.element('.p_stanza:nth-child(' + (index + 1) + ')');
        $scope.p_stanza.find('textarea').arabisk();
        console.log("$scope.p_stanza.find('#edit_stanza_text_area')", $scope.p_stanza.find('textarea').html());

        if ($scope.tab.includes('pending'))
            $scope.edit_stanza_text = $scope.pending_stanzas[index].stanza_text;
        else
            $scope.edit_stanza_text = $scope.approved_stanzas[index].stanza_text;
    };

    $scope.changeTab = function(tab) {
        $scope.tab = tab;
        console.log('  $scope.tab ', $scope.tab);
        $scope.getStanzas($scope.tab, "");
    };

    $scope.update_stanza = function(update_behavior, stanza_id, index, stanza_text) {
        $scope.$parent.hide_message_banner = true;
        if ($scope.tab == 'approved')
            $scope.current_stanzas = $scope.approved_stanzas;
        else
            $scope.current_stanzas = $scope.pending_stanzas;

        if ($scope.edit_stanza_index !== index)
            stanza_text = $scope.current_stanzas[index].stanza_text;
        else {
            stanza_id = $scope.current_stanzas[index].id;
        }
        stanzaService.updateStanza(update_behavior, stanza_id, stanza_text)
            .then(
                function(updated) {
                    if (updated) {
                        if (update_behavior == 'approved') {
                            $scope.stanzas_to_add = $scope.approved_stanzas;
                        } else if (update_behavior == 'rejected') {
                            $scope.stanzas_to_add = $scope.rejected_stanzas;
                        } else if (update_behavior == 'pending approval') {
                            update_behavior = 'updated';
                            $scope.current_stanzas[index].stanza_text = stanza_text;

                            $scope.p_stanza.scope().show_edit_area = false;

                        } else if (update_behavior == 'published') {
                            $scope.stanzas_to_add = $scope.published_stanzas;
                        }

                        $scope.$parent.server_message = gettext('The stanza is ' + update_behavior);
                        $scope.$parent.hide_message_banner = false;

                        $timeout(function() {
                            $scope.$parent.hide_message_banner = true;
                        }, $scope.server_message_hide_delay);

                        if (update_behavior != 'updated') {
                            $scope.stanzas_to_add.splice(0, 0, $scope.current_stanzas[index]);

                            if (update_behavior == 'published')
                                $scope.approved_stanzas.splice(index, 1);
                            else {
                                $scope.current_stanzas.splice(index, 1);
                            }
                        }

                        $scope.edit_stanza_index = null;
                        $scope.edit_stanza_text = null;
                    }
                },
                errorhandler
            );
    };


    $scope.search_in_stanzas = function() {
        $scope.old_tab = $scope.tab;
        $scope.$parent.tab = "search";
        $scope.tab = "search";
        $scope.search_close_btn = true;
        $scope.getStanzas($scope.old_tab, $scope.search_query);
    };

    $scope.reset_search_in_stanzas = function() {
        $scope.old_tab = ($scope.old_tab == undefined) ? $scope.tab : $scope.old_tab;
        $scope.search_close_btn = false;
        $scope.changeTab($scope.old_tab);
    };
    $scope.getStanzas($scope.tab, "");
    $scope.route_change_render_ejs($scope);
});