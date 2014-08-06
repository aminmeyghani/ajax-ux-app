angular.module('ModuleOne', [])

.factory('Auth', function(){
  var user;

  return{
    setUser : function(aUser){
      user = aUser;
    },
    isLoggedIn : function(){
      return(user)? user : false;
    }
  }
})

.controller("MainCtrl", function ($scope, $http, $resource, $q, $timeout, Facebook, $location, Auth) {
  $scope.main = "Main from module controller ...";
  // $scope.isLoggedin = FB.getUserID() === true

  $scope.$watch(function() {
    return Facebook.isReady();
  }, function(newVal) {
    if(Facebook.isReady()){
    	$scope.isLoggedin = !!FB.getUserID() === true
    	$scope.isAppLoaded = true;
      
      Auth.setUser(!!FB.getUserID() === true)
    }
  });

  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/');
    }

    if(value) {
      // when refreshing the page.
      console.log("Connect");
      //Do something when the user is connected
      $location.path("/dashboard");
    }

  }, true);

})

.controller("DashboardCtrl", function ($scope, $http, $resource, $q, $timeout, Facebook) {
  // getting books data
  $q.all([$http({method: "GET",url: "/books"})
  ]).then(function(response) {$scope.books = response[0].data;});
  // function for getting user data
  $scope.me = function() {

    Facebook.api('/me', function(response) {
      $scope.myData = response;
    });
  };
 })

.controller('LoginCtrl', [ '$scope', 'Auth','Facebook','$location', function ($scope, Auth, Facebook, $location) {

  $scope.loginWithFB = function () {
    console.log("loging in ...")
    Facebook.login(function(response) {
      if (response.status == 'connected') {
        $scope.isLoggedin = 1;
        console.log($scope.isLoggedin);

        Facebook.api('/me', function(response) {
          $scope.myData = response;
        });

        Auth.setUser(true);

        $location.url("/dashboard")
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
      Auth.setUser(false);
      $location.url("/");
    });
  };

  
}])