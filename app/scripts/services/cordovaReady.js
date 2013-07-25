'use strict';

/*
  The cordovaReady service can be used as a wrapper around calls to the native
  API's. It ensures that the cordova lib has fully loaded before doing any
  calls to the native API's. Calls that happen before cordova is fully loaded
  get queued and executed once cordova is fully loaded.
*/
angular.module('livingtownApp')
  .factory('cordovaReady', function () {
    return function (fn) {
      var queue = [];

      var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
      };

      document.addEventListener('deviceready', function () {
        queue.forEach(function (args) {
          fn.apply(this, args);
        });
        impl = fn;
      }, false);

      return function () {
        return impl.apply(this, arguments);
      };
    };
  });
