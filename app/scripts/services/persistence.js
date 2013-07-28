'use strict';

/*
  Singleton with the sole purpose to store the current location literal.
  Can be injected so different controllers can check if the user is now
  in a different town (e.g. when driving around).
*/
angular.module('livingtownApp')
  .factory('persistence', function() {

    return {
      init: function(location) {
        this.location = location;
      }
    }

  })
