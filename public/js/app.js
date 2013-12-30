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

kioskApp.service('slideShow', function($rootScope, $timeout) {
  var slideShowService = {
    pause: function(auto) {
      $rootScope.$broadcast('stateChanged', 'paused');
      window.kioskSwipe.pause();
      clearTimeout(window.timeout);
      if(auto){
        window.timeout = setTimeout(function(){
          slideShowService.continue();
        }, $rootScope.config.touchTimeout);
      }
    },
    continue: function() {
      window.kioskSwipe.play($rootScope.config.auto);
      $rootScope.$broadcast('stateChanged', 'playing');
    },
    setup: function() {
      $rootScope.$broadcast('stateChanged', 'setup');
      
      // this height does not account for body margin
      $('div.stage').css('height', $rootScope.config.viewportHeight + 'px');
      $('div.extra').css('height', $rootScope.config.viewportHeight + 'px');
      $('a.close').css('left', ($rootScope.config.viewportWidth - 350) + 'px').css('top', '139px');
      $('div.gallery').css('height', ($rootScope.config.viewportHeight) + 'px');
      
      // this width does not account for scrollbar
      $('.swipe-image img').css('width', $rootScope.config.viewportWidth + 'px');
      
      window.kioskSwipe = Swipe($("#slider")[0], {
        auto: $rootScope.config.auto,
        continuous: $rootScope.config.continuous,
        disableScroll: true,
        callback: function(event) {
          if(event.type && event.type == "touchmove"){
            slideShowService.pause(true);
          }
        }
      });
      
      $timeout(function(){
        var sliderCssHeight = $('#slider').css('height');
        var leftButton = $('a#left');
        var rightButton = $('a#right');
        
        leftButton.show().css('height', $rootScope.config.viewportHeight + 'px');
        leftButton.click(function(e){
          e.preventDefault();
          slideShowService.pause(true);
          window.kioskSwipe.prev();
        });
        
        rightButton.show().css('height', $rootScope.config.viewportHeight + 'px')
          .css('right', '0px');
        rightButton.click(function(e){
          e.preventDefault();
          slideShowService.pause(true);
          window.kioskSwipe.next();
        });
        
        // HACK this width is a magic number
        $('#slider p.caption').css('width', '800px');

        $('a.close').click(function(e) {
          e.preventDefault();
        });
        
        $('a.play-video').css('left', ($rootScope.config.viewportWidth-64)/2 + 'px')
          .css('top', ($rootScope.config.viewportHeight-64)/2 + 'px')
          .click(function(e) {
            e.preventDefault();
            sliderCssHeight = $('#slider').css('height');
            $('div.lightbox').css('height', sliderCssHeight);
            $('a.close').css('left', ($rootScope.config.viewportWidth - 350) + 'px').css('top', '139px');
          });
        
        $('a.learn-more').css('left', ($rootScope.config.viewportWidth-200)/2 + 'px')
          .css('top', ($rootScope.config.viewportHeight-80-80) + 'px')
          .click(function(e) {
            sliderCssHeight = $('#slider').css('height');
            $('div.gallery div.view').css('height', ($rootScope.config.viewportHeight) + 'px');
            $('div.gallery div.thumbnails').css('height', ($rootScope.config.viewportHeight + 72) + 'px');
            
            $('div.gallery div.thumbnails img').click(function(e) {
              $('div.gallery div.view img').attr('src', $(this).data('big'));
            });
            
            e.preventDefault();
          });  
      }, 100);
      
      $('div.lightbox').on('click', function(e) {
        $rootScope.$broadcast('touch', 'lightbox');
        
      });
      
      $('.extra .video, .extra video').on('click', function(e) {
        $rootScope.$broadcast('touch', 'video');
      });
      
      $rootScope.$broadcast('stateChanged', 'playing');
    }
  };
  return slideShowService;
});

kioskApp.run(function($rootScope) {
  $rootScope.state = 'init';
  $rootScope.config = {
    viewportHeight: $(window).height(),
    viewportWidth: $(window).width(),
    auto: 5000,
    continuous: true,
    touchTimeout: 5000
  };
});
  
$( document ).ready(function() {
    console.log( "ready!" );
});  
