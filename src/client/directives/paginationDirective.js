var app = angular.module('app');

app.directive("paginationDirective", function($compile) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: "../../views/templates/pagination.html",
        link: function(scope, element){
            var html = ejs.render(element.find('script').html(), { no_of_submissions: scope.no_of_submissions });
            element.html($compile(html)(scope));    
        },
        controller: function($scope){
            $scope.get_stanzas_from_navigation = function(event, page) {
                console.log('getting records from ' + $scope.current_page.level * 100 + " to " + ($scope.current_page.level * 100 + 100));

                if (page == 'pre') {
                    $scope.current_page.level = ($scope.current_page.level > 0) ? ($scope.current_page.level - 1) : $scope.current_page.level;
                } else if (page == 'next') {
                    $scope.current_page.level =
                        (($scope.no_of_submissions > 100) && ($scope.no_of_submissions > ($scope.current_page.level * 100 + 100))) ? ($scope.current_page.level + 1) : $scope.current_page.level;
                } else
                    $scope.current_page.level = page / 100;

                if (($scope.no_of_submissions > 100) && (($scope.current_page.level * 100) < $scope.no_of_submissions)) {
                    $scope.getStanzas($scope.tab, "");
                }
            };
        }
    };
});