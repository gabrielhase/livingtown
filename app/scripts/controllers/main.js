'use strict';

angular.module('livingtownApp')
  .controller('MainCtrl', function ($scope, $location, geolocation, mockData) {

    // init leaflet empty
    $scope.center = {}
    $scope.markers = {}

    // locate the user
    geolocation.getCurrentPosition({timeout: 5000})
      .then(function(position){
        angular.extend($scope, {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              zoom: 12
            },
            markers: mockData.get(),
            located: true
        });
      }, function(error) {
        $location.path( "/needLocation" );
      });

    // center a location (upon clicking a message)
    $scope.centerLocation = function(marker) {
      $scope.center.lat = marker.lat;
      $scope.center.lng = marker.lng;
    };

  });
