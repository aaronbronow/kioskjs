var kioskControllers = angular.module('kioskControllers', []);

kioskControllers.controller('AdminCtrl', ['$scope', '$timeout', '$http', '$location', '$routeParams', 'slideShow',
  function($scope, $timeout, $http, $location, $routeParams, slideShow) {
    $http.get('api/kiosks/').success(function(data) {
      $scope.$location = $location;
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
        
        for(var i = 0; i < $scope.kiosk.scenes.length; i++) {
          if($scope.kiosk.scenes[i].gallery && typeof($scope.kiosk.scenes[i].gallery) != 'undefined') {
            $('#extra-' + i + ' .gallery').load('api/kiosks/' + $scope.kiosk.hashname + '/gallery.html', function( response, status, xhr ) {
              if ( status != "error" ) {
                
              };
            });  
        
          }
        }
      }, 100);
      
    });
    
  }]
);
  
kioskControllers.controller('StageCtrl', ['$scope', '$timeout', '$http', '$routeParams', 'slideShow',
  function($scope, $timeout, $http, $routeParams, slideShow) {
    
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
      case 'gallery':
        clearTimeout($scope.galleryTimeout);
        $scope.galleryTimeout = setTimeout(function(){
          $scope.close();
        }, 30000);
        break;
      }
    });
      
    $scope.play = function(slide){
      $scope.currentSlide = slide;
      console.log('play video');
      $('#extra-' + slide).show().addClass('lightbox');
      $('a.close').show();
      $('a.arrow').hide();
      slideShow.pause();
      
      $timeout(function(){
        var video = $('#video-' + slide)[0];
        video.load();
        video.play();
      }, 100);
    };
    
    $scope.learn = function(slide){
      $scope.currentSlide = slide;
      console.log('learn more');
      $('#extra-' + slide).show().addClass('lightbox');
      $('a.close').show();
      $('a.arrow').hide();
      slideShow.pause();
      clearTimeout($scope.galleryTimeout);
      $scope.galleryTimeout = setTimeout(function(){
        $scope.close();
      }, 30000);
    };
    
    $scope.close = function(){
      $('a.close').hide();
      $('a.arrow').show();
      $('div.lightbox').hide();
      $('div.gallery div.caption').hide();
      var video = $('#video-' + $scope.currentSlide)[0];
      if(video && typeof(video) != 'undefined'){
        video.load();
        video.pause();
      }
      clearTimeout($scope.galleryTimeout);
      slideShow.continue();
      $('#slider').click();
    };

  }]
);

