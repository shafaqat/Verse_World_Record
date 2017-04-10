var app = angular.module('app');
app.directive("containerDirective", function($timeout, $compile, $window, localizationService) {
    return {
        restrict: 'E',
        transclude: true,
        scope: false,
        templateUrl: "../../views/templates/container.html",
        link: function link(scope, el) {
            var ng_view_template;
            var ng_view_child_scope;
            var nav_header_template;
            var rtl_bootstrap_style_link_el = '<link css-layout-type="rtl" rel="stylesheet" type="text/css" href="/public/libs/bootstrap-rtl.min.css" />';
            var head_el = angular.element('head');

            scope.route_change_render_ejs = function(child_scope) {
                localizationService.getchangedLocale(scope.lang).then(function(result) {
                    scope.locale = result.messages;
                    locale = scope.locale;

                    ng_view_child_scope = child_scope;
                    var ng_view = angular.element('#ngView');
                    nav_header_template = angular.element('#navigation_header').html();

                    ng_view_template = ng_view.html();
                    var html = ejs.render(nav_header_template + ng_view_template, { no_of_submissions: scope.no_of_submissions });
                    ng_view.parent().html($compile(html)(child_scope));

                    angular.element('#ng_view_container').find('#countries').val(scope.lang);
                    enable_function_of_dropdown_timer_arabic_inputs();

                    if (scope.lang.includes('ar') && head_el.find('[css-layout-type="rtl"]').length < 1) head_el.append(rtl_bootstrap_style_link_el);
                });
            };

            scope.changeLocale = function(lang) {
                $window.localStorage.setItem('lang', lang);
                scope.lang = lang;
                scope.show_loading_spinner = true;

                localizationService.getchangedLocale(lang).then(function(result) {
                    scope.locale = result.messages;
                    locale = scope.locale;
                    var ng_view = angular.element('#ng_view_container');
                    var template = nav_header_template + ng_view_template;
                    var html = ejs.render(template, { no_of_submissions: scope.no_of_submissions });
                    html = $compile(html)(ng_view_child_scope);
                    ng_view.html(html);

                    var rtl_bootstrap_DOM_link_el = head_el.find('[css-layout-type="rtl"]');

                    if (rtl_bootstrap_DOM_link_el.length < 1 && scope.lang.includes('ar')) head_el.append(rtl_bootstrap_style_link_el);
                    else if (rtl_bootstrap_DOM_link_el.length > 0 && scope.lang.includes('en')) rtl_bootstrap_DOM_link_el.remove();

                    ng_view.find('#countries').val(lang);
                    enable_function_of_dropdown_timer_arabic_inputs();
                    scope.show_loading_spinner = false;
                });
            };

            var enable_function_of_dropdown_timer_arabic_inputs = function enable_function_of_dropdown_timer_arabic_inputs() {
                angular.element("#search-input").arabisk();
                angular.element("#search-input-sticky").arabisk();
                angular.element("textarea").arabisk();
                angular.element("#submitter_name").arabisk();
                angular.element("#countries").msDropdown();

                var verseTopNav = angular.element('#verseTopNav');
                angular.element("#countries_msdd").click(function() {
                    verseTopNav.toggleClass('ddcommonIphoneClass');
                    // verseTopNav.animate({ scrollTop: verseTopNav.prop("scrollHeight") }, 300);
                });
                angular.element("button[data-target='#verseTopNav']").click(function() {
                    verseTopNav.removeClass('ddcommonIphoneClass');
                });

                scope.timerFunc();
            };

            scope.timerFunc = function() {
                angular.element('.countdown.styled').countdown({
                    date: scope.submissions_closed_date,
                    render: function render(data) {
                        $(this.el).html("<div>" + parseInt(this.leadingZeros(data.days, 2)).toLocaleString(scope.lang) + "<p>:</p> <span>days</span></div><div>" + parseInt(this.leadingZeros(data.hours, 2)).toLocaleString(scope.lang) + "<p>:</p> <span>hrs</span></div><div>" + parseInt(this.leadingZeros(data.min, 2)).toLocaleString(scope.lang) + "<p>:</p> <span>min</span></div><div>" + parseInt(this.leadingZeros(data.sec, 2)).toLocaleString(scope.lang) + " <span>sec</span></div>");
                    },
                    onEnd: function onEnd() {
                        scope.set_submissions_closed();
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
        },
        controller: function controller($scope, $rootScope) {
            $scope.set_submissions_closed = function() {
                $rootScope.submissions_closed = true;
                $scope.$apply();
            };

            var checkForDirectiveLoaded = function checkForDirectiveLoaded() {
                $scope.isDirectiveLoaded = true;
            };
            checkForDirectiveLoaded();
        }
    };
});