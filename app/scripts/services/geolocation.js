'use strict';

/*
  Locates a users device
*/
angular.module('livingtownApp')
  .factory('geolocation', function($rootScope, cordovaReady) {

    return {
      getCurrentPosition: cordovaReady(function (options, locationPromise) {
        console.log("calling navigator API");
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log("got position");
          $rootScope.$apply(function() {
            locationPromise.resolve(position);
          });
        }, function () {
          console.log("did not get position");
          $rootScope.$apply(function() {
            locationPromise.reject('Could not get device location. Please enable location services on your device.');
          });
        },
        options);
        return locationPromise.promise; // called when cordova already loaded
      })
    };
  });
