'use strict';

angular.module('livingtownApp', ['leaflet-directive', 'firebase'])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/needLocation', {
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // so requests from localhost work
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
