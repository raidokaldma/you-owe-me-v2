'use strict';

var YouOweMeApp = angular.module('youOweMe', ['ngAnimate', 'ngRoute', 'ngCookies'])
    .config(function ($routeProvider) {
        $routeProvider.
            when('/:key', {
                templateUrl: 'assets/html/main.html'
            }).
            when('/action/new', {
                redirectTo: function() {
                    var newKey = Math.random().toString(16).substr(2);
                    return '/' + newKey;
                }
            }).
            otherwise({
                redirectTo: function () {
                    return '/action/last';
                }
            });
    });

