'use strict';

angular.module('livingtownApp')
  .factory('photo', function(cordovaReady) {

    return {

      takePhoto: cordovaReady(function(photoPromise) {
        //console.log(navigator);
        navigator.camera.getPicture(function(imageURI) {
          console.log('success');
          photoPromise.resolve(imageURI);
        }, function() {
          console.log('fail');
          photoPromise.reject('fail');
        }, {quality: 50,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: navigator.camera.DestinationType.FILE_URI});
        return photoPromise.promise;
      })
    }

  });
