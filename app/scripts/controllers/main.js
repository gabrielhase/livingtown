'use strict';

angular.module('livingtownApp')
  .controller('MainCtrl', function ($scope, geolocation) {

    geolocation.getCurrentPosition()
      .then(function(position){
        console.log(position);
        alert('Latitude: '              + position.coords.latitude          + '\n' +
            'Longitude: '             + position.coords.longitude         + '\n' +
            'Altitude: '              + position.coords.altitude          + '\n' +
            'Accuracy: '              + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: '     + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '               + position.coords.heading           + '\n' +
            'Speed: '                 + position.coords.speed             + '\n' +
            'Timestamp: '             + position.timestamp                + '\n');
      }, function(error) {
        alert('failed with error: ' + error);
      });


/*
    function (position) {
      alert('Latitude: '              + position.coords.latitude          + '\n' +
            'Longitude: '             + position.coords.longitude         + '\n' +
            'Altitude: '              + position.coords.altitude          + '\n' +
            'Accuracy: '              + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: '     + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '               + position.coords.heading           + '\n' +
            'Speed: '                 + position.coords.speed             + '\n' +
            'Timestamp: '             + position.timestamp                + '\n');
    });
*/
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
