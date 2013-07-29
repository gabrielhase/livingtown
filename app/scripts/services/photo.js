'use strict';

angular.module('livingtownApp')
  .factory('photo', function(cordovaReady) {

    return {

      takePhoto: cordovaReady(function(photoPromise) {
        console.log(navigator);
        navigator.camera.getPicture(function(imageURI) {
          console.log('success');
          photoPromise.resolve('success');
        }, function() {
          console.log('fail');
          photoPromise.reject('fail');
        }, {quality: 50, sourceType: Camera.PictureSourceType.PHOTOLIBRARY, destinationType: Camera.destinationType.FILE_URI});
        return photoPromise.promise;
      })
    }

  });
