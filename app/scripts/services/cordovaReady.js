'use strict';

/*
  The cordovaReady service can be used as a wrapper around calls to the native
  API's. It ensures that the cordova lib has fully loaded before doing any
  calls to the native API's. Calls that happen before cordova is fully loaded
  get queued and executed once cordova is fully loaded.
*/
angular.module('livingtownApp')
  .factory('cordovaReady', function ($q) {
    return function (fn) { // this function is called where the wrapper is applied
      var queue = [];

      // push the arguments onto the queue as an array
      var impl = function () {
        var args = Array.prototype.slice.call(arguments);
        queue.push(args);
        var defered = args[args.length - 1];
        return defered.promise;
      };

      document.addEventListener('deviceready', function () {
        // apply fn with each set of arguments it was queued
        queue.forEach(function (args) {
          fn.apply(this, args);
        });
        impl = fn;
      }, false);

      // this function is called whereever the wrapped function is called
      return function () {
        // add a defered as the last argument
        var defered = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        args.push(defered); // make the defered object the last arg
        return impl.apply(this, args);
      };
    };
  });
