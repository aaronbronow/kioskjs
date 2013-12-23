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
      var viewportWidth = $(window).width();
      $('div.stage').css('height', viewportHeight + 'px')
        .css('display', 'table-cell')
        .css('vertical-align', 'middle');
        
      $('.swipe-image img').css('width', viewportWidth + 'px');
      
      window.kioskSwipe = Swipe($("#slider")[0], {
        auto: 5000,
        continuous: true,
        callback: function(event) {
    
          if(event.type && event.type == "touchmove"){
            window.kioskSwipe.pause();
            clearTimeout(window.timeout);
            window.timeout = setTimeout(function(){
              window.kioskSwipe.play(5000);
            }, 5000); // slideshow starts playing in 10 seconds
          }
        }
      });
      
      // TODO figure out how to do this without setTimeout
      setTimeout(function(){
        var sliderCssHeight = $('#slider').css('height');
        var leftButton = $('a#left');
        var rightButton = $('a#right');
        
        leftButton.show().css('height', sliderCssHeight);
        leftButton.click(function(e){
          e.preventDefault();
          window.kioskSwipe.pause();
          window.kioskSwipe.prev();
          clearTimeout(window.timeout);
          window.timeout = setTimeout(function(){
            window.kioskSwipe.play(5000);
          }, 5000); // slideshow starts playing in 10 seconds
        });
        
        rightButton.show().css('height', sliderCssHeight)
          .css('right', '0px');
        rightButton.click(function(e){
          e.preventDefault();
          window.kioskSwipe.pause();
          window.kioskSwipe.next();
          clearTimeout(window.timeout);
          window.timeout = setTimeout(function(){
            window.kioskSwipe.play(5000);
          }, 5000);
        });
        
        // HACK this width is a magic number
        $('#slider p.caption').css('width', '800px');

        $('a.play-video').css('left', (viewportWidth-64)/2 + 'px')
          .css('top', (viewportHeight-64)/2 + 'px')
          .click(function(e) {
            e.preventDefault();
            window.kioskSwipe.pause();
            clearTimeout(window.timeout);
            $('div.extra').css('height', viewportHeight + 'px').show().addClass('lightbox');
            $('a.close').css('left', (viewportWidth - 64-64) + 'px').css('top', '20px').show();
            setTimeout(function(){
              $('#intro-video-1')[0].play();
            }, 100);
            
          });
          
        $('a.learn-more').css('left', (viewportWidth-200)/2 + 'px')
          .css('top', (viewportHeight-80-80) + 'px')
          .click(function(e) {
            e.preventDefault();
            window.kioskSwipe.pause();
            clearTimeout(window.timeout);
            $('div.extra').css('height', viewportHeight + 'px').show().addClass('lightbox');
            $('div.content').load('api/kiosks/intro/gallery.html', function( response, status, xhr ) {
              if ( status != "error" ) {
                $('div.gallery').css('height', (viewportHeight - 100) + 'px');
              };
            });
          });  
      }, 100);
      
      $('div.lightbox').on('click', function(e) {
        $('#intro-video-1')[0].stop();
        
        $('div.lightbox').removeClass('lightbox');
      });
      
      $('#intro-video-1').on('click', function(e) {
        $('div.lightbox').removeClass('lightbox');
        window.kioskSwipe.play(5000);
      });
    }
  }
  });

$( document ).ready(function() {
    console.log( "ready!" );
    
});  
