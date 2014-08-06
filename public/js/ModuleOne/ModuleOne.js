angular.module('ModuleOne', [])

.controller("MainCtrl", function ($scope, $http, $resource, $q, $timeout,Facebook) {
  $scope.main = "Main from module controller ...";
  // $scope.isLoggedin = FB.getUserID() === true

  $scope.$watch(function() {
    return Facebook.isReady();
  }, function(newVal) {
    if(Facebook.isReady()){
    	$scope.isLoggedin = !!FB.getUserID() === true
    	$scope.isAppLoaded = true;
    }

  });

  $scope.loginWithFB = function () {
  	console.log("loging in ...")
    Facebook.login(function(response) {
      if (response.status == 'connected') {
        $scope.isLoggedin = 1;
        console.log($scope.isLoggedin)
      } else {
        $scope.isLoggedin = 0;
        console.log($scope.isLoggedin)
      }
    });
  };

  $scope.logout = function () {
  	console.log("loging out ...")
    Facebook.logout(function(response) {
      console.log("logged out");
      $scope.isLoggedin = 0;
    });
  };

  $scope.me = function() {
    Facebook.api('/me', function(response) {
      $scope.myData = response;
    });
  };

})

.controller("DashboardCtrl", function ($scope, $http, $resource, $q, $timeout) {
  $q.all([$http({method: "GET",url: "/books"})
  ]).then(function(response) {$scope.books = response[0].data;});
 })
