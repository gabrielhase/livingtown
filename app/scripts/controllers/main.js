'use strict';

/*
  Note: The messages are stored on the $rootScope so they can be:
  (1) accessed from all controllers
  (2) angularFire (firebase) has one point of control to update them
*/
angular.module('livingtownApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, geolocation, mockData, angularFire, persistence) {

    // init leaflet empty
    $scope.center = {};
    $scope.markers = {};

    // setup the angularFire connection to our firebase for this city
    var setupMarkerListener = function(location) {
      // get messages from firebase
      var url = 'https://livingtown.firebaseio.com/messages/' + location.city + '-' + location.state;
      angularFire(url, $rootScope, 'messages', [])
        .then(function() {
          $rootScope.angularFireIsRunning = true;
          $rootScope.$watch('messages', function() {
            drawMarkers($scope, $rootScope);
          });
        });
    };

    // center a location (upon clicking a message)
    $scope.centerLocation = function(marker) {
      $scope.center.lat = marker.lat;
      $scope.center.lng = marker.lng;
    };

    // => main code
    // locate the user
    geolocation.locate()
      .then(function(location) {
        angular.extend($scope, {
          center: {
            lat: location.lat,
            lng: location.lng,
            zoom: 12
          },
          located: true
        });
        if ($rootScope.angularFireIsRunning) drawMarkers($scope, $rootScope);
        persistence.init(location);
        setupMarkerListener(location);
      }, function(error) {
        if(error.type === 'notLocalizable') {
          $location.path( "/needLocation" );
        } else {
          alert(error.message);
        }
      });
  });


// defines what happens when a user clicks on a marker
var scrollCallback = function(marker) {
  var $elem = $('#marker-' + marker.id);
  var $streamContainer = $('#messageStream');
  $streamContainer.scrollTo($elem, 800);
};


function drawMarkers($scope, $rootScope) {
  console.log("drawing markers...");
  // reformat messages for leaflet markers
  var markers = {};
  for (var i = 0; i < $rootScope.messages.length; i++) {
    markers[i] = $rootScope.messages[i];
    markers[i].id = i + 1;
    markers[i].clickCallback = scrollCallback;
  }
  $scope.markers = markers;
}
