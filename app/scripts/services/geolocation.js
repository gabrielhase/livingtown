'use strict';

/*
  Locates a users device
*/
angular.module('livingtownApp')
  .factory('geolocation', function($rootScope, $q, cordovaReady) {
    return {
      getCurrentPosition: cordovaReady(function (options) {

        var locationPromise = $q.defer()

        navigator.geolocation.getCurrentPosition(function (position) {

          $rootScope.$apply(function() {
            locationPromise.resolve(position);
          });
        }, function () {
          $rootScope.$apply(function() {
            locationPromise.reject('Could not get device location. Please enable location services on your device.');
          });
        },
        options);

        return locationPromise.promise;
      })
    };
  });
