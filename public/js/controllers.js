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
            $('#extra-' + i + ' .gallery').load('api/kiosks/intro/gallery.html', function( response, status, xhr ) {
              if ( status != "error" ) {
                
              };
            });  
        
          }
        }
      }, 0);
      
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
      }
    });
      
    $scope.play = function(slide){
      $scope.currentSlide = slide;
      console.log('play video');
      $('#extra-' + slide).show().addClass('lightbox');
      $('a.close').show();
      $('a.arrow').hide();
      slideShow.pause();
      
      setTimeout(function(){
        $('#video-' + slide)[0].play();
      }, 100);
    };
    
    $scope.learn = function(slide){
      $scope.currentSlide = slide;
      console.log('learn more');
      $('#extra-' + slide).show().addClass('lightbox');
      $('a.close').show();
      $('a.arrow').hide();
      slideShow.pause();
    };
    
    $scope.close = function(){
      $('a.close').hide();
      $('a.arrow').show();
      $('div.lightbox').hide();
      var video = $('#video-' + $scope.currentSlide)[0];
      if(video && typeof(video) != 'undefined'){
        video.pause();
      }
      slideShow.continue();
    };
    

  }]
);

