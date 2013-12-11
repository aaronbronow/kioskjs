var kioskSwipe;
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
      console.log("Set up slideshow...");
      
      // TODO figure out how to do this with angular
      $('div.admin').hide();
      
      // this height does not account for body margin
      var viewportHeight = $(window).height();
      $('div.stage').css('height', viewportHeight + 'px')
        .css('display', 'table-cell')
        .css('vertical-align', 'middle');
      
      window.kioskSwipe = Swipe($("#slider")[0], {
        auto: 5000,
        continuous: true
      });
      
      // TODO on touch event the swipe autoplay stops. figure out how to start it again after x seconds.
      
      // TODO figure out how to do this without setTimeout
      setTimeout(function(){
        var sliderCssHeight = $('#slider').css('height');
        var leftButton = $('a#left');
        var rightButton = $('a#right');
        
        leftButton.show().css('height', sliderCssHeight);
        leftButton.click(function(e){
          e.preventDefault();
          window.kioskSwipe.prev();
        });
        
        rightButton.show().css('height', sliderCssHeight)
          .css('right', '0px');
        rightButton.click(function(e){
          e.preventDefault();
          window.kioskSwipe.next();
        });
        
        // HACK this width is a magic number
        $('#slider p.caption').css('width', '800px');
        
      }, 100);
      
    }
  }
  });

$( document ).ready(function() {
    console.log( "ready!" );
    
});  
