var app = angular.module('app');

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/home',
            access: { requiredLogin: false }
        })
        .when('/home', {
            templateUrl: 'views/templates/home.html',
            controller: 'homeController',
            access: { requiredLogin: false }
        })
        .when('/panel', {
            templateUrl: 'views/templates/panel.html',
            controller: 'panelController',
            access: { requiredLogin: true }
        })
        .when('/login', {
            templateUrl: 'views/templates/login.html',
            controller: 'loginController',
            access: { requiredLogin: false }
        })
        .when('/submit', {
            templateUrl: 'views/templates/submit.html',
            controller: 'homeController',
            access: { requiredLogin: false }
        })
        .when('/forget-password', {
            templateUrl: 'views/templates/forget-password.html',
            controller: 'loginController',
            access: { requiredLogin: false }
        })
        .when('/reset-password', {
            templateUrl: 'views/templates/reset-password.html',
            controller: 'loginController',
            access: { requiredLogin: false }
        })
        .otherwise({
            template: "<h1>404</h1><p>Nothing has been found</p>",
            access: { requiredLogin: false }
        });;

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.run(function($rootScope, authService, $location) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin || nextRoute.originalPath == '/login') {
            authService.checkJudgeType().then(function(judge) {
                if (!judge.logInStatus)
                    $location.path('/login');
                else
                    $location.path('/panel');
            });
        }

    });
});