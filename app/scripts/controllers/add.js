'use strict';

angular.module('livingtownApp')
  .controller('AddCtrl', function($scope, $rootScope, $location, geolocation, persistence, photo) {

    geolocation.locate()
      .then(function(location) {
        if (persistence.location.city !== location.city ||
            persistence.location.state !== location.state) {
          // re-setup angularFire connection to push message to the right town
          var url = 'https://livingtown.firebaseio.com/messages/' + location.city + '-' + location.state;
          angularFire(url, $rootScope, 'messages', [])
          .then(function(unbind){
            if ($rootScope.angularReset) $rootScope.angularReset();
            $rootScope.angularReset = unbind;
            persistence.init(location);
          });
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

    $scope.takePhoto = function() {
      console.log('taking picture');
      photo.takePhoto()
        .then(function(result) {
          console.log('took photo: ' + result);
        });
    };

    //$scope.takePhoto();

    $scope.addMessage = function() {
      $rootScope.messages.push({
        lat: persistence.location.lat,
        lng: persistence.location.lng,
        message: $scope.message,
        date: new Date().getTime()
      })

      $scope.message = '';
      $location.path('/');
    }
  });
