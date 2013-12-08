var kioskSwipe;
var kioskTimer;
var kioskApp = angular.module('kioskApp', [
  'ngRoute',
  'kioskControllers'
]);

kioskApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/play/:hashname', {
        templateUrl: 'partials/play.html',
        controller: 'PlayCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
  
kioskApp.service('slideShow', function() {
  return {
    setup: function() {
      console.log("Set up slideshow...")
    }
  }
  });

$( document ).ready(function() {
    console.log( "ready!" );
    
});  
