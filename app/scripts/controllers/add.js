'use strict';

/*
  Add a message for this town.
  NOTE: will re-locate the user so to make sure that the user didn't cross a
  town border in the meantime and the message would be located in the wrong
  town.
  Since images are only shown in 50x50 this script will use canvas to resize
  the image to 100x100 (to handle retina displays correctly).
*/
angular.module('livingtownApp')
  .controller('AddCtrl', function($scope, $rootScope, $location, geolocation, persistence, photo) {

    geolocation.locate({ maximumAge:60000, timeout: 1000 })
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
    $scope.imageSrc = '';
    $scope.imageData = '';

    $scope.takePhoto = function() {
      photo.takePhoto()
        .then(function(result) {
          $scope.imageSrc = result;

          // resize using an invisible canvas element
          var imageObj = new Image();
          imageObj.onload = function() {
            $('#scaleCanvas')[0].getContext("2d").drawImage(imageObj, 0, 0, 100, 100);
            $scope.imageData = $('#scaleCanvas')[0].toDataURL();
          };
          imageObj.src = result;

/*
          // CROPPING
          var imageObj = new Image();
          imageObj.onload = function() {
            console.log("imageObj loaded");
            var sourceX = $('#image').width() / 2 - 50;
            var sourceY = $('#image').height() / 2 - 50;
            var sourceWidth = $('#image').width() / 2 + 50;
            var sourceHeight = $('#image').height() / 2 + 50;
            var destWidth = 100;
            var destHeight = 100;
            var destX = 0;
            var destY = 0;
            $('#scaleCanvas')[0].getContext("2d").drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
          }
          imageObj.src = result;
*/
          return result;
        }, function(error) {
          alert(error);
        });
    };

    $scope.addMessage = function() {
      $rootScope.messages.push({
        lat: persistence.location.lat,
        lng: persistence.location.lng,
        message: $scope.message,
        date: new Date().getTime(),
        image: $scope.imageData
      })

      $scope.message = '';
      $location.path('/');
    }
  });
