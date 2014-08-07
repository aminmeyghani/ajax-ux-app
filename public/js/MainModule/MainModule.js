angular.module('MainModule', [])

// service to keep track of the state of the user.
.factory('Auth', function(){
  var user;
  return{
    setUser : function(aUser) {
      user = aUser;
    },
    isLoggedIn : function(){
      return(user)? user : false;
    }
  }
})

// Main controller controlling the whole app. The highest level controller.
.controller("MainCtrl", [ "$scope", "$http", "Facebook", "Auth", "$rootScope", "$location", "$timeout", function ($scope, $http, Facebook, Auth, $rootScope, $location, $timeout) {
  // for offline testing.
  // $scope.isAppLoaded = true;
  //

  // checking if the Facebook wrapper is ready.
  // The facebook api is instantially asynchronously, because of that, we need to watch 
  // for the ready event. When the API is ready, then the `FB` global object is ready to go !
  // The Facebook module is a wrapper for the `FB` object.
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


  // Control for authentication routing. Let users go to dashboard only if they are logged in.
  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
    if(!value && oldValue) { $location.path('/')}
    if(value) { $location.path("/dashboard")}
  }, true);


  // Everytime route changes test and see if we are on the homepage.
  $rootScope.$on('$routeChangeStart', function () {
    $scope.isHome = ($location.url() == "/") ? (true) : (false);  
  });
}])
// Higher level controller for the dashboard.
.controller("DashboardCtrl", [ "$scope", "$http", "$q", "Facebook", function ($scope, $http, $q, Facebook) {
  // Getting the list of books asynchronously by calling the REST API.
  // Express takes care of the rest after the SQL query is run with node.
  $q.all([$http({method: "GET",url: "/books"})
  ]).then(function(response) {$scope.books = response[0].data;});
  // Get my data from facebook ...
  // get a user's picture.
  // graph.facebook.com/345157298969677/picture?type=large
  $scope.getMyData = function() {
    Facebook.api('/me', function(response) {
      $scope.myData = response;
    });
  };
 }])

.controller('LoginCtrl', [ '$scope', 'Auth','Facebook','$location', function ($scope, Auth, Facebook, $location) {
  // login handler for facebook.
  $scope.loginWithFB = function () {
    Facebook.login(function(response) {
      if (response.status == 'connected') {
        // when connected, set the service value to true.
        Auth.setUser(true);
        // ask the state of the user from Auth.
        $scope.isLoggedin = Auth.isLoggedIn();
        // redirect to dashboard on login.
        $location.url("/dashboard")
      } else {
        // log in wasn't successful ...
        Auth.setUser(false);
        $scope.isLoggedin = Auth.isLoggedIn();
      }
    });
  };
  // logout the user from the app (and facebook)
  $scope.logout = function () {
    Facebook.logout(function(response) {
      console.log("logged out");
      Auth.setUser(false);
      $scope.isLoggedin = Auth.isLoggedIn();
      $location.url("/");
    });
  };
}])