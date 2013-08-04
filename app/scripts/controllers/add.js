'use strict';

/*
  Add a message for this town.
  NOTE: will re-locate the user so to make sure that the user didn't cross a
  town border in the meantime and the message would be located in the wrong
  town.
  Since images are only shown in 70x70 this script will use canvas to resize
  the image to 140x140 (to handle retina displays correctly).
  In a production app one would probably want to keep higher resolution copies
  as well, but since the free firebase account is very limited in file size I
  keep only small images here.
*/
angular.module('livingtownApp')
  .controller('AddCtrl', function($scope, $rootScope, $location, geolocation, persistence, photo, angularFire) {

    $scope.message = '';
    $scope.imageSrc = '';
    $scope.imageData = 'images/no-image.png'; // the default, if the user doesn't upload

    geolocation.locate({ maximumAge:60000, timeout: 1000 })
      .then(function(location) {
        if (persistence.location === undefined ||
            persistence.location.city !== location.city ||
            persistence.location.state !== location.state) {
          // re-setup angularFire connection to push message to the right town
          var url = 'https://livingtown.firebaseio.com/messages/' + location.city + '-' + location.state;
          var ref = new Firebase(url).startAt().limit(100);
          angularFire(ref, $rootScope, 'messages', [])
          .then(function(unbind){
            if ($rootScope.angularReset) $rootScope.angularReset();
            $rootScope.angularReset = unbind;
            persistence.init(location);
          });
        }
        $scope.located = true; // show the form only when the location is correct
      }, function(error) {
        $location.path("/location-error");
      });

    $scope.takePhoto = function() {
      // NOTE: due to an iOS quirk when closing the camera window this call can not
      // go through the cordovaReady promise-based interface (on the phone the call
      // would not trigger).
      // In a production app I would make a separate cordovaReady interface for the camera, but since this
      // is on the second screen anyway and there is no way to get here without cordova
      // being ready I think it's safe to call it directly.
      navigator.camera.getPicture(function(result) {
        $scope.imageSrc = result;

        // resize using an invisible canvas element
        var imageObj = new Image();
        imageObj.onload = function() {
          $('#scaleCanvas')[0].getContext("2d").drawImage(imageObj, 0, 0, 140, 140);
          $scope.$apply(function(){
            $scope.imageData = $('#scaleCanvas')[0].toDataURL();
          });
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

        }, function(error) {
            alert(error);
        },{quality: 50,
          //sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, // TODO: change this depending if you're on the simulator or the actual phone
          sourceType: navigator.camera.PictureSourceType.CAMERA,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          targetWidth: 140,
          targetHeight: 140});
    };

    $scope.addMessage = function() {
      if ($scope.message === '') {
        alert('you need to enter a message.');
      } else {

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
    }
  });
