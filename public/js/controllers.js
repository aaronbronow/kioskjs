var kioskControllers = angular.module('kioskControllers', []);

kioskControllers.controller('AdminCtrl', ['$scope', '$timeout', '$http', '$routeParams', 'slideShow',
  function($scope, $timeout, $http, $routeParams, slideShow) {
    $http.get('api/kiosks/').success(function(data) {
      $scope.kiosks = data;
      console.log(data);
      
      $timeout(function(){
        $('li.tile a').each( function(index, element) {
          element.addEventListener('click', function(e){
            if(!$scope.fullscreen) 
              return;
            var el = document.documentElement, rfs =
                   el.requestFullScreen
                || el.webkitRequestFullScreen
                || el.mozRequestFullScreen;
            rfs.call(el);
          });
        });
      }, 0);
      
    });
  }]);

kioskControllers.controller('PlayCtrl', ['$scope', '$timeout', '$http', '$routeParams', 'slideShow',
  function($scope, $timeout, $http, $routeParams, slideShow) {
    $http.get('api/kiosks/' + $routeParams.hashname).success(function(data) {
      $scope.kiosk = data;
      console.log($routeParams.hashname, data);
      
      $timeout(function(){
        slideShow.setup();
      }, 0);
      
    });
    
    $scope.$on('stateChanged', function(event, args) {
      console.log(args);
    });
    
    $scope.$on('touch', function(event, args) {
      console.log('touched');
      
      switch(args){
      case 'lightbox':
        $scope.close();
        break;
      case 'video':
        $scope.close();
        break;
      }
    });
      
    $scope.play = function(){
      console.log('play video');
      $('div.extra').show().addClass('lightbox');
      $('a.close').show();
      $('a.arrow').hide();
      slideShow.pause();
      
      setTimeout(function(){
        $('#intro-video-1')[0].play();
      }, 100);
    };
    
    $scope.learn = function(){
      console.log('learn more');
      $('div.extra').show().addClass('lightbox');
      $('a.close').show();
      $('a.arrow').hide();
      slideShow.pause();
      
      $('div.content').load('api/kiosks/intro/gallery.html', function( response, status, xhr ) {
        if ( status != "error" ) {
          $('div.gallery').css('height', ($rootScope.config.viewportHeight - 100) + 'px');
        };
      });
    };
    
    $scope.close = function(){
      $('a.close').hide();
      $('a.arrow').show();
      $('div.lightbox').hide();
      $('#intro-video-1')[0].pause();
      slideShow.continue();
    };
    
  }]);
