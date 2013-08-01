'use strict';

/*
  Locates a users device
*/
angular.module('livingtownApp')
  .factory('geolocation', function($rootScope, $http, $q, cordovaReady, persistence) {

    var googleEndpoint = 'http://maps.googleapis.com/maps/api/geocode/json';

    return {


      watchLocation: cordovaReady(function ($scope, options, watchPromise) {
        // move with the phone
        navigator.geolocation.watchPosition(function(position) {
          geolocation.getLocationIdentifier(position.coords.latitude, position.coords.longitude)
            .then(function(location) { // in the browser there is never a callback
              $scope.$apply(function(){
                $scope.center.lat = location.lat;
                $scope.center.lng = location.lng;
                persistence.init(location);
                $scope.setupMarkerListener(location);
              });
            });
        }, function(error) {
          console.log('error while watching device position');
        }, options);
      }),


      locate: function(options) {
        var that = this;
        var locationPromise = $q.defer();
        that.getCurrentPosition(options)
          .then(function(position){
            that.getLocationIdentifier(position.coords.latitude, position.coords.longitude)
              .then(function(formattedResult) {
                // add the lat, lng
                formattedResult.lat = position.coords.latitude;
                formattedResult.lng = position.coords.longitude;

                locationPromise.resolve(formattedResult);
              }, function(errorMsg) {
                locationPromise.reject({
                  type: 'locationNotFound',
                  message: errorMsg
                });
              })
          }, function(error) {
            locationPromise.reject({
              type: 'notLocalizable',
              message: 'Could not localize this device'
            });
          });

        return locationPromise.promise;
      },


      getCurrentPosition: cordovaReady(function (options, locationPromise) {
        navigator.geolocation.getCurrentPosition(function (position) {

/*
          console.log(position.coords);
          // TODO: hack code to test changing town
          if (Math.random() > 0.5) { // sometimes place in Boston
            position = undefined;
            position = {
              coords: {
                latitude: 42.359935,
                longitude: -71.057159
              }
            }
            console.log("haaaack!");
          }
*/
          $rootScope.$apply(function() {
            locationPromise.resolve(position);
          });
        }, function () {
          $rootScope.$apply(function() {
            locationPromise.reject('Could not get device location. Please enable location services on your device.');
          });
        },
        options);
        return locationPromise.promise; // called when cordova already loaded
      }),


      getLocationIdentifier: function(lat, lng) {
        var locationPromise = $q.defer();
        var that = this;
        $http.get(googleEndpoint + '?latlng=' + lat + ',' + lng + '&sensor=true')
          .success(function(data) {
            var formattedAddress = that.formatLocationIdentifier(data);
            if (formattedAddress.error != '') {
              locationPromise.reject(formattedAddress.error);
            } else {
              locationPromise.resolve(formattedAddress);
            }
          })
          .error(function(error) {
            locationPromise.reject('Could not get data about current location from Google.');
          })

        return locationPromise.promise;
      },


      formatLocationIdentifier: function(address) {
        var error = '';
        if (address.status !== 'OK') {
          error = 'Could not get any address information from Google. Try again. ';
        } else {

          var components = address.results[0].address_components;
          var geometry = address.results[0].geometry;

          for (var i = 0; i < components.length; i++) {
             var comp = components[i];

             // city
             if (comp.types.indexOf("locality") !== -1) {
                 var city = comp.long_name;
             }
             // state
             else if (comp.types.indexOf("administrative_area_level_1") !== -1) {
                 var state = comp.short_name;
             }
           }

          if (typeof city === 'undefined') {
            error += 'Could not find a city for the given location. ';
          }
          if (typeof state === 'undefined') {
            error += 'Could not find a state for the given location. ';
          }
        }

        return {
          city: city,
          state: state,
          error: error
        }
      }
    };
  });
