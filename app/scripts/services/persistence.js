'use strict';

angular.module('livingtownApp')
  .factory('persistence', function() {

    return {

      // these are necessary for persistence -> in closure
      //var lat, lng, location, messages;

      init: function(lat, lng, url) {
        this.lat = lat;
        this.lng = lng;
        this.url = url;
      }
    }

  })
