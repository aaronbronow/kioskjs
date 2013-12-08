var kioskControllers = angular.module('kioskControllers', []);
 
kioskControllers.controller('IndexCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $scope.play = function(){
      $scope.playMode = true;
    };
    $scope.stop = function(){
      $scope.playMode = false;
      clearInterval(window.kioskTimer);
    };
    
    $http.get('api/kiosks/').success(function(data) {
        $scope.kiosks = data;
      });
  }]);

kioskControllers.controller('PlayCtrl', ['$scope', '$http', '$routeParams', 'slideShow',
  function($scope, $http, $routeParams, slideShow) {
    $http.get('api/kiosks/' + $routeParams.hashname).success(function(data) {
        $scope.kiosk = data;
        slideShow.setup();
        
        setTimeout(function(){
            window.kioskSwipe = Swipe($("#slider")[0])
            
            var sliderHeight = $("#slider").height();
            
            // TODO move this to css
            var leftButton = document.createElement('img');
            leftButton.src = 'img/1386238146_icon-ios7-arrow-left.png';
            leftButton.className = 'left-button';
            
            var rightButton = document.createElement('img');
            rightButton.src = 'img/1386238146_icon-ios7-arrow-right.png';
            rightButton.className = 'right-button';
            
            $(".swipe-image img").before(leftButton).after(rightButton);
            
            // TODO refactor this into app as live or build a handler to set this
            $(".swipe-image .left-button").click(window.kioskSwipe.prev).css("position: absolute; top: -128px");
            $(".swipe-image .right-button").click(window.kioskSwipe.next);
            
            $scope.playMode = true;
            
            window.kioskTimer = setInterval(function(){
              window.kioskSwipe.next();
            }, 5000);
            
            }, 10);
      });
  }]);
