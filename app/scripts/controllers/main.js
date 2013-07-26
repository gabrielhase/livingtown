'use strict';

angular.module('livingtownApp')
  .controller('MainCtrl', function ($scope, geolocation) {
    geolocation.getCurrentPosition({timeout: 5000})
      .then(function(position){
        angular.extend($scope, {
            center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                zoom: 12
            },
            located: true
        });
        /*
        alert('Latitude: '              + position.coords.latitude          + '\n' +
            'Longitude: '             + position.coords.longitude         + '\n' +
            'Altitude: '              + position.coords.altitude          + '\n' +
            'Accuracy: '              + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: '     + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '               + position.coords.heading           + '\n' +
            'Speed: '                 + position.coords.speed             + '\n' +
            'Timestamp: '             + position.timestamp                + '\n');
      */
      }, function(error) {
        alert('failed with error: ' + error);
      });
  });
