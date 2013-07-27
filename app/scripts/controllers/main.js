'use strict';

angular.module('livingtownApp')
  .controller('MainCtrl', function ($scope, $location, geolocation, mockData, angularFire) {

    // init leaflet empty
    $scope.center = {};
    $scope.markers = {};

    // setup the angularFire connection to our firebase for this city
    var setupPersistence = function(location) {
      // get messages from firebase
      var url = 'https://livingtown.firebaseio.com/messages/' + location.city + '-' + location.state;
      var realTimePromise = angularFire(url, $scope, 'messages', []);

      realTimePromise.then(function() {
        startWatch($scope);
      });
    };

    // center a location (upon clicking a message)
    $scope.centerLocation = function(marker) {
      $scope.center.lat = marker.lat;
      $scope.center.lng = marker.lng;
    };

    // => main code
    // locate the user
    geolocation.getCurrentPosition({timeout: 5000})
      .then(function(position){
        geolocation.getLocationIdentifier(position.coords.latitude, position.coords.longitude)
          .then(function(formattedResult) {
            console.log(formattedResult);
            // TODO: for the mock data
            formattedResult.city = "Cambridge";
            angular.extend($scope, {
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                zoom: 12
              },
              located: true
            });
            setupPersistence(formattedResult);
          }, function(error) {
            alert(error);
          })
      }, function(error) {
        $location.path( "/needLocation" );
      });
  });


// defines what happens when a user clicks on a marker
var scrollCallback = function(marker) {
  var $elem = $('#marker-' + marker.id);
  var $streamContainer = $('#messageStream');
  $streamContainer.scrollTo($elem, 800);
};


// events for our persisted objects
function startWatch($scope) {

  $scope.$watch('messages', function() {
    // reformat messages for leaflet markers
    var markers = {};
    for (var i = 0; i < $scope.messages.length; i++) {
      markers[i] = $scope.messages[i];
      markers[i].id = i + 1;
      markers[i].clickCallback = scrollCallback;
    }
    $scope.markers = markers;
  });

}
