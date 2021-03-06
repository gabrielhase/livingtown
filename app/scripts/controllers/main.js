'use strict';

/*
  Renders the positioning on the map as well as the persisted messages for
  the current town.
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
          if (!$rootScope.angularFireIsRunning) { // only setup the scope watch the first time
            $rootScope.$watch('messages', function() {
              $scope.drawMarkers();
            });
          }
          $rootScope.angularFireIsRunning = true;
        });
      if ($rootScope.angularFireIsRunning) $scope.drawMarkers();
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
      geolocation.locate({ maximumAge:10, timeout: 1000 })
      .then(function(location) {
        $scope.showSpinner = false;
        // redraw the markers
        persistence.init(location);
        setupMarkerListener(location);
        // change the location on the map
        $scope.center.lat = location.lat;
        $scope.center.lng = location.lng;
      }, function(error) {
        // NOTE: for now this is just one error page, but of course one could be more specific
        $location.path("/location-error");
      });
    };

    // locate the user on hitting the page
    // cache location for 1 minute, should be fine for not too quickly moving users (e.g. by foot)
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
        persistence.init(location);
        setupMarkerListener(location);
      }, function(error) {
        $location.path("/location-error");
      });
    // NOTE: this only does something for the device or the simulator, in the browser it is mocked with an empty function since the browser has no capabilities for watching the position
    geolocation.watchLocation($scope, { maximumAge: 10, timeout: 1000 });


    // defines what happens when a user clicks on a marker
    var scrollCallback = function(marker) {
      var $elem = $('#marker-' + marker.id);
      var $streamContainer = $('#messageStream');
      $streamContainer.scrollTo($elem, 800);
    };


    $scope.drawMarkers = function() {
      if ($rootScope.messages === undefined) return;
      // reformat messages for leaflet markers
      // NOTE: when clicking really quickly then there is a possibility for running
      // conditions on the async callbacks, thus this ensures "thread" safety.
      if (!$rootScope.drawingMarkersInProgress) {
        $rootScope.drawingMarkersInProgress = true;
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
        $rootScope.drawingMarkersInProgress = false;
      }
    }
  });
