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
      var leftButton = $('a#left');
      var rightButton = $('a#right');
      var closeButton = $('a#close');
      
      $rootScope.$broadcast('stateChanged', 'setup');
      
      // this height does not account for body margin
      $('div.stage').css('height', $rootScope.config.viewportHeight + 'px');
      $('div.extra').css('height', $rootScope.config.viewportHeight + 'px');
      closeButton.css('left', ($rootScope.config.viewportWidth - 350) + 'px').css('top', '139px');
      $('div.gallery').css('height', ($rootScope.config.viewportHeight) + 'px');
      
      // this width does not account for scrollbar
      $('.swipe-image img').css('width', $rootScope.config.viewportWidth + 'px');
      
      // if the swipe object is already setup kill it before setting up again
      if(typeof(window.kioskSwipe) == 'object') {
        window.kioskSwipe.kill();
        leftButton.unbind('click').unbind('dragstart');
        rightButton.unbind('click').unbind('dragstart');
        // closeButton.unbind('click').unbind('dragstart');
        // $('a.play-video').unbind('click');
        // $('a.learn-more').unbind('click');
        // $('a.lightbox').unbind('click');
        // $('.extra .video, .extra video').unbind('click');
      }
      
      window.kioskSwipe = Swipe($("#slider")[0], {
        auto: $rootScope.config.auto,
        continuous: $rootScope.config.continuous,
        disableScroll: true,
        speed: $rootScope.config.speed,
        callback: function(event) {
          if(event.type && event.type == "touchmove"){
            slideShowService.pause(true);
          }
        }
      });
      
      $timeout(function(){
        var sliderCssHeight = $('#slider').css('height');
        
        leftButton.show().css('top', ($rootScope.config.viewportHeight - 128) + 'px');
        leftButton.click(function(e){
          e.preventDefault();
          slideShowService.pause(true);
          window.kioskSwipe.prev();
        });
        leftButton.on('dragstart', function(e){
          e.preventDefault();
          window.kioskSwipe.prev();
        });
        
        rightButton.show().css('top', ($rootScope.config.viewportHeight - 128) + 'px')
          .css('right', '0px');
        rightButton.click(function(e){
          e.preventDefault();
          slideShowService.pause(true);
          window.kioskSwipe.next();
        });
        rightButton.on('dragstart', function(e){
          e.preventDefault();
          window.kioskSwipe.next();
        });
        
        // HACK this width is a magic number
        $('#slider p.caption').css('width', '800px');

        closeButton.click(function(e) {
          e.preventDefault();
        });
        closeButton.on('dragstart', function(e){
          e.preventDefault();
          $rootScope.$broadcast('touch', 'lightbox');
        })
        
        $('a.play-video').css('left', '524px')
          .css('top', ($rootScope.config.viewportHeight-96)/2 + 'px')
          .click(function(e) {
            e.preventDefault();
            sliderCssHeight = $('#slider').css('height');
            $('div.lightbox').css('height', sliderCssHeight);
            $('a.close').css('left', ($rootScope.config.viewportWidth - 350) + 'px').css('top', '139px');
          });
        
        $('a.learn-more').css('left', '1102px')
          .css('top', ($rootScope.config.viewportHeight-24)/2 + 'px')
          .click(function(e) {
            sliderCssHeight = $('#slider').css('height');
            $('div.gallery div.view').css('height', ($rootScope.config.viewportHeight) + 'px');
            $('div.gallery div.thumbnails').css('height', ($rootScope.config.viewportHeight + 72) + 'px');
            $('a.close').css('left', ($rootScope.config.viewportWidth - 75 - 30) + 'px').css('top', '40px');
            $('div.gallery div.caption').show();
      
            $('div.gallery div.thumbnails img').click(function(e) {
              $('div.gallery div.view img').attr('src', $(this).data('big'));
              $('div.gallery div.caption').html($(this).data('caption'));
              $rootScope.$broadcast('touch', 'gallery');
            });
            
            $('div.gallery div.thumbnails img').first().click();
            
            e.preventDefault();
          });  
      }, 100);
      
      $('div.lightbox').on('click', function(e) {
        $rootScope.$broadcast('touch', 'lightbox');
        
      });
      
      $('.extra .video, .extra video').on('click', function(e) {
        $rootScope.$broadcast('touch', 'video');
      }).on('ended', function(e) {
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
    auto: 8000,
    speed: 1000,
    continuous: true,
    touchTimeout: 5000
  };
});
  
$( document ).ready(function() {
    console.log( "ready!" );
});  
