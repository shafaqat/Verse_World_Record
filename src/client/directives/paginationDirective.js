var app = angular.module('app');

app.directive("paginationDirective", function($compile) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: "../../views/templates/pagination.html",
        link: function(scope, element) {
            scope.pagination_template = element.find('#pagination_template').html();
            scope.pagination_template_container = element.find('#pagination_template_container');

            var render_container_pagination = function() {
                var html = ejs.render(scope.pagination_template, { no_of_submissions: scope.no_of_submissions });
                scope.pagination_template_container.html($compile(html)(scope));

                angular.element('[data-toggle="tooltip"]').tooltip();

            };
            scope.$watch(function() { return scope.no_of_submissions; }, function(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    render_container_pagination();
                }
            });
            render_container_pagination();
        },
        controller: function($scope) {
            $scope.get_stanzas_from_navigation = function(event, page) {
                console.log('getting records from ' + $scope.current_page.level * 100 + " to " + ($scope.current_page.level * 100 + 100));

                if (page == 'pre') {
                    $scope.current_page.level = ($scope.current_page.level > 0) ? ($scope.current_page.level - 1) : $scope.current_page.level;
                } else if (page == 'next') {
                    $scope.current_page.level =
                        (($scope.no_of_submissions > 100) && ($scope.no_of_submissions > ($scope.current_page.level * 100 + 100))) ? ($scope.current_page.level + 1) : $scope.current_page.level;
                } else
                    $scope.current_page.level = page / 100;

                if (($scope.current_page.level > 0 && ($scope.no_of_submissions > ($scope.current_page.level * 100 + 100))) && ($scope.no_of_submissions > 100) && (($scope.current_page.level * 100) < $scope.no_of_submissions)) {
                    $scope.getStanzas($scope.tab, "");
                }
            };
        }
    };
});