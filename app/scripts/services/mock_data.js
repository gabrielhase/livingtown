'use strict';

/*
  A set of mock data retrieved from http://bostoneventsinsider.com/
*/
angular.module('livingtownApp')
  .factory('mockData', function() {

    var scrollCallback = function(data) {
      var $elem = $('#' + data.id);
      var $streamContainer = $('#messageStream');
      $streamContainer.scrollTo($elem, 800);
    };

    return {
      get: function() {
        return {
          1: {
            id: 'marker-1',
            lat: 42.359935,
            lng: -71.057159,
            message: "This Festival features a parade, various performances and even a choir of kids coming all the way down from Puerto Rico. That's awesome!",
            clickCallback: scrollCallback
          },
          2: {
            id: 'marker-2',
            lat: 42.366573,
            lng: -71.052677,
            message: "St. Josephs Feast Celebration. Lots of catholics, but still fun.",
            clickCallback: scrollCallback
          },
          3: {
            id: 'marker-3',
            lat: 42.364398,
            lng: -71.111498,
            message: "This is a magic and comedy show, mostly for kids. There's a movie screening after the show.",
            clickCallback: scrollCallback
          },
          4: {
            id: 'marker-4',
            lat: 42.394976,
            lng: -71.122428,
            message: "This is a southern-style hog roast and street festival to benefit charity. Live music.",
            clickCallback: scrollCallback
          }
        }
      }
    }
  });
