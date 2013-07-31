'use strict';

/*
  Note: The messages are stored on the $rootScope so they can be:
  (1) accessed from all controllers
  (2) angularFire (firebase) has one point of control to update them
  In order to change the Firebase url at runtime, e.g. when a user leaves
  one town and enters another, we need to keep track of the unbind callback
  as well which has to be called before attaching a new url.
*/
angular.module('livingtownApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, geolocation, mockData, angularFire, persistence) {

    // init leaflet empty
    $scope.center = {};
    $scope.markers = {};

    $scope.height = ($(window).height() / 2) - 40;

    // setup the angularFire connection to our firebase for this city
    var setupMarkerListener = function(location) {
      // get messages from firebase
      var url = 'https://livingtown.firebaseio.com/messages/' + location.city + '-' + location.state;
      var ref = new Firebase(url).startAt().limit(100);
      angularFire(ref, $rootScope, 'messages', [])
        .then(function(unbind) {
          if ($rootScope.angularReset) $rootScope.angularReset();
          $rootScope.angularReset = unbind;
          $rootScope.angularFireIsRunning = true;
          $rootScope.$watch('messages', function() {
            drawMarkers($scope, $rootScope, persistence);
          });
        });
    };

    // center a location (upon clicking a message)
    $scope.centerLocation = function(marker) {
      $scope.center.lat = marker.lat;
      $scope.center.lng = marker.lng;
    };

    $scope.getTimeIdentifier = function(marker) {
      var date = moment(marker.date);
      return date.fromNow();
    };

    $scope.reLocate = function() {
      // upon hitting the button it should not take a cached location
      $scope.showSpinner = true;
      geolocation.locate({ maximumAge:1, timeout: 1000 })
      .then(function(location) {
        $scope.showSpinner = false;
        if (persistence.location.city !== location.city ||
            persistence.location.state !== location.state) {
          persistence.init(location);
          setupMarkerListener(location);
          drawMarkers($scope, $rootScope, persistence);
        }
        // just change the location on the map
        $scope.center.lat = location.lat;
        $scope.center.lng = location.lng;

      }, function(error) {
        if(error.type === 'notLocalizable') {
          $location.path( "/needLocation" );
        } else {
          $location.path( "/needLocation" ); // TODO: maybe pass custom error messages here
        }
      });
    };


    // locate the user on hitting the page
    // cache location for 1 minute, should be fine, even for moving users
    $scope.showSpinner = true;
    geolocation.locate({ maximumAge:60000, timeout: 1000 })
      .then(function(location) {
        $scope.showSpinner = false;
        angular.extend($scope, {
          center: {
            lat: location.lat,
            lng: location.lng,
            zoom: 12
          },
          located: true
        });
        //if ($rootScope.angularFireIsRunning) drawMarkers($scope, $rootScope, persistence); // when coming back from another page
        persistence.init(location);
        setupMarkerListener(location);
        drawMarkers($scope, $rootScope, persistence);
      }, function(error) {
        if(error.type === 'notLocalizable') {
          $location.path('/needLocation');
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


function drawMarkers($scope, $rootScope, persistence) {
  if ($rootScope.messages === undefined) return;
  // reformat messages for leaflet markers
  var markers = {};
  for (var i = 0; i < $rootScope.messages.length; i++) {
    markers[i] = $rootScope.messages[i];
    markers[i].id = i + 1;
    markers[i].clickCallback = scrollCallback;
  }

  // the users position
  markers[i+1] = {
    type: 'user',
    lat: persistence.location.lat,
    lng: persistence.location.lng,
    icon: 'images/current-position.png'
  };

  $scope.markers = markers;
}
