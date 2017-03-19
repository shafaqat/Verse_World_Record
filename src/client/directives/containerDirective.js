var app = angular.module('app');
app.directive("containerDirective", function($timeout, $compile, $window, localizationService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: false,
        templateUrl: "../../views/templates/container.html",
        link: function(scope, el) {
            var ng_view_template;
            var ng_view_child_scope;
            var nav_header_template;


            scope.route_change_render_ejs = function(child_scope) {
                angular.element(document).ready(function() {
                    // $timeout(function() {
                        ng_view_child_scope = child_scope;

                        var ng_view = angular.element('#ngView');
                        nav_header_template = angular.element('#navigation_header').html();
            
                        ng_view_template = ng_view.html();
                        var html = ejs.render(nav_header_template + ng_view_template, { no_of_submissions: scope.no_of_submissions });
                        ng_view.parent().html($compile(html)(child_scope));    
                    
                        angular.element('#ng_view_container').find('#countries').val(scope.lang);
                        $('[data-toggle="tooltip"]').tooltip();

                        angular.element("#search-input").arabisk();
                        angular.element("textarea").arabisk();
                        $("#countries").msDropdown();
                        scope.timerFunc();
                    // }, 150);
                });
            };

            scope.changeLocale = function(lang) {
                $window.localStorage.setItem('lang', lang);
                scope.lang = lang;
                localizationService.getchangedLocale(lang).then(
                    function(result) {
                        scope.locale = result.messages;
                        locale = scope.locale;
                        var ng_view = angular.element('#ng_view_container');
                        var template = nav_header_template + ng_view_template;
                        var html = ejs.render(template, { no_of_submissions: scope.no_of_submissions });
                        html = $compile(html)(ng_view_child_scope);
                        ng_view.html(html);

                        ng_view.find('#countries').val(lang);
                        $("#countries").msDropdown();

                        $('[data-toggle="tooltip"]').tooltip();
                        angular.element("textarea").arabisk();
                        angular.element("#search-input").arabisk();
                        scope.timerFunc();
                    });
            };

            scope.timerFunc = function() {
                var endDate = "March 23, 2017 00:00:00";
                angular.element('.countdown.styled')
                    .countdown({
                        date: endDate,
                        render: function(data) {
                            $(this.el).html(
                                "<div>" + parseInt(this.leadingZeros(data.days, 2)).toLocaleString(scope.lang) +
                                "<p>:</p> <span>days</span></div><div>" +
                                parseInt(this.leadingZeros(data.hours, 2)).toLocaleString(scope.lang) +
                                "<p>:</p> <span>hrs</span></div><div>" +
                                parseInt(this.leadingZeros(data.min, 2)).toLocaleString(scope.lang) +
                                "<p>:</p> <span>min</span></div><div>" +
                                parseInt(this.leadingZeros(data.sec, 2)).toLocaleString(scope.lang) + " <span>sec</span></div>");
                        },
                        onEnd: function() {
                            scope.submissions_closed = true;
                            scope.$apply();
                        }
                    });
            };
       
            angular.element($window).bind("scroll", function() {
                if (this.pageYOffset >= 50 && !scope.boolShowStaticHeader) {
                    scope.boolShowStaticHeader = true;
                    scope.$apply();
                } else if (this.pageYOffset < 5 && scope.boolShowStaticHeader) {
                    scope.boolShowStaticHeader = false;
                    scope.$apply();
                }
            });
            changeLocale = scope.changeLocale;
        }

    };
});