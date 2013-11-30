var kioskApp = angular.module('kioskApp', []);
 
kioskApp.controller('IndexCtrl', function ($scope, $http) {
  $http.get('api/kiosks/').success(function(data) {
      $scope.kiosks = data;
    });
});
