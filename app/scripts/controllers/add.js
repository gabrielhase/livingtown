'use strict';

angular.module('livingtownApp')
  .controller('AddCtrl', function($scope, $rootScope, $location, persistence) {

    $scope.message = '';

    $scope.addMessage = function() {
      $rootScope.messages.push({
        lat: persistence.lat,
        lng: persistence.lng,
        message: $scope.message
      })

      $scope.message = '';
      $location.path('/');
    }
  });
