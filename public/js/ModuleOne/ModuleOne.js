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
  $scope.$watch(function() {
    return Facebook.isReady();
  }, function(newVal) {
      if(Facebook.isReady()) {
        // initially checks to see if the user is logged in.
        Auth.setUser(!!FB.getUserID() === true)
        $scope.isLoggedin = Auth.isLoggedIn();
        // finally app is loaded.
        $scope.isAppLoaded = true;
      }
  });

  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    if(!value && oldValue) {
      console.log("Disconnect");
      $location.path('/');
    }
    // when logged in.
    if(value) {
      console.log("Connect");
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
    Facebook.login(function(response) {
      if (response.status == 'connected') {
        console.log("loging in ...")
        // when connected, set the service value to true.
        Auth.setUser(true);
        $scope.isLoggedin = Auth.isLoggedIn();

        // go to user dashboard.
        $location.url("/dashboard")
      } else {
        Auth.setUser(false);
        $scope.isLoggedin = Auth.isLoggedIn();
      }
    });
  };

  $scope.logout = function () {
    console.log("loging out ...")
    Facebook.logout(function(response) {
      console.log("logged out");
      Auth.setUser(false);
      $scope.isLoggedin = Auth.isLoggedIn();
      $location.url("/");
    });
  };

  
}])