'use strict';

angular.module('livingtownApp', ['leaflet-directive', 'firebase'])
  .config(function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/location-error', {
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl'
      })
      .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'AddCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // so requests from localhost work
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // HTML 5 mode -> uses history API
    // NOTE: this is not working with cordova!!!
    //return $locationProvider.html5Mode(true);
  });
