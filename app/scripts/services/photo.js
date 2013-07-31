'use strict';

angular.module('livingtownApp')
  .factory('photo', function($rootScope, cordovaReady) {

    return {

      takePhoto: cordovaReady(function(options, photoPromise) {
        navigator.camera.getPicture(function(imageURI) {
          photoPromise.resolve(imageURI);
        }, function() {
          photoPromise.reject('failed to take a picture');
        }, {quality: 50,
          //sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, // TODO: change this depending if you're on the simulator or the actual phone
          sourceType: navigator.camera.PictureSourceType.CAMERA,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          targetWidth: 140,
          targetHeight: 140});
        return photoPromise.promise;
      })
    }
  });
