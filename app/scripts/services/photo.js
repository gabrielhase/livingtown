'use strict';

angular.module('livingtownApp')
  .factory('photo', function(cordovaReady) {

    return {

      takePhoto: cordovaReady(function(photoPromise) {
        navigator.camera.getPicture(function(imageURI) {
          console.log('success');
          photoPromise.resolve(imageURI);
        }, function() {
          console.log('fail');
          photoPromise.reject('failed to take a picture');
        }, {quality: 50,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, // TODO: change this when going to the actual phone
          destinationType: navigator.camera.DestinationType.FILE_URI});
        return photoPromise.promise;
      })
    }

  });
