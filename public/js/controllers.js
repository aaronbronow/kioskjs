var kioskControllers = angular.module('kioskControllers', []);
 
kioskControllers.controller('IndexCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('api/kiosks/').success(function(data) {
        $scope.kiosks = data;
      });
  }]);

kioskControllers.controller('PlayCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $http.get('api/kiosks/' + $routeParams.hashname).success(function(data) {
        $scope.kiosk = data;
        
        setTimeout(function(){window.kioskSwipe = Swipe($("#slider")[0])}, 10);
      });
  }]);
