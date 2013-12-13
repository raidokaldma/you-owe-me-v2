'use strict';

var YouOweMeApp = angular.module('youOweMe', ['ngAnimate', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.
            when('/:id', {
                templateUrl: 'assets/html/main.html'
            }).
            otherwise({
                redirectTo: function () {
                    var hash = Math.random().toString(16).substr(2);
                    return '/' + hash;
                }
            });
    })
;
