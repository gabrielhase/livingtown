'use strict';

angular.module('livingtownApp')
  .controller('AddCtrl', function($scope, $rootScope, $location, geolocation, persistence) {

    geolocation.locate()
      .then(function(location) {
        if (persistence.location.city !== location.city ||
            persistence.location.state !== location.state) {
          // re-setup angularFire connection to push message to the right town
          var url = 'https://livingtown.firebaseio.com/messages/' + location.city + '-' + location.state;
          angularFire(url, $rootScope, 'messages', []);
          persistence.init(location);
        }
        $scope.located = true; // show the form only when the location is correct
      }, function(error) {
        if(error.type === 'notLocalizable') {
          $location.path( "/needLocation" );
        } else {
          alert(error.message);
        }
      });

    $scope.message = '';

    $scope.addMessage = function() {
      $rootScope.messages.push({
        lat: persistence.location.lat,
        lng: persistence.location.lng,
        message: $scope.message
      })

      $scope.message = '';
      $location.path('/');
    }
  });
