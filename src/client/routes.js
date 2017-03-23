var app = angular.module('app');

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .when('/home', {
            templateUrl: 'views/templates/home.html',
            controller: 'homeController'
        })
        .when('/panel', {
            templateUrl: 'views/templates/panel.html',
            controller: 'panelController'
        })
        .when('/login', {
            templateUrl: 'views/templates/login.html',
            controller: 'loginController'
        })
        .when('/submit', {
            templateUrl: 'views/templates/submit.html',
            controller: 'homeController'
        })
        .when('/forgot-password', {
            templateUrl: 'views/templates/forgot-password.html',
            controller: 'loginController'
        })
        .when('/reset-password', {
            templateUrl: 'views/templates/reset-password.html',
            controller: 'loginController'
        })
        .when('/404', {
            templateUrl: 'views/templates/404.html'
        })
        .otherwise({
            redirectTo: '/404'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});