angular.module('MainModule', ['MainApp'])

// service to keep track of the state of the user.
.service('Auth', function(Facebook){
  var user;
  var my = {};
  var activePage;
  return{
    setUser : function(aUser) {user = aUser;},
    isLoggedIn : function(){return(user)? user : false;},
    setMy: function (attr, val) {my[attr] = val;},
    getMy: function (attr) {return my[attr]},
    getMe: function () {return my },
    // wrapper for calling api queries.
    runQuery: function (what, callback) {
      Facebook.getLoginStatus(function(response){
        if (response.status === 'connected') {
          Facebook.api(what, function (r){ callback(qdata = r)});
        } else if (response.status === 'not_authorized') {
          console.log("Please confirm the app so that you can connect to it")
        } else {
          console.log("Please log in to your facebook account.")
        }
      })
    },
    // Ajax in logged in user picture from the facebook account.
    setLoginPic: function (callback) {
      var thiz = this;
      Facebook.getLoginStatus(function(response){
        if (response.status === 'connected') {
          thiz.runQuery("/me/picture", function (pic) {callback( pic.data.url)});
        }
      })
    },
    // set the current path (the active page)
    setActivePage: function (p) { activePage = p},
    // get the current path (the active page)
    getActivePage: function () { return activePage },
  }
})

// Main controller controlling the whole app. The highest level controller.
.controller("MainCtrl", [ "$scope", "$http", "Facebook", "Auth", "$rootScope", "$location", "$timeout","$route", "$routeParams", function ($scope, $http, Facebook, Auth, $rootScope, $location, $timeout, $routeParams) {
  // for offline testing.
  // $scope.isAppLoaded = true;
  //
  $scope.$routeParams = $routeParams;

  // checking if the Facebook wrapper is ready.
  // The facebook api is instantially asynchronously, because of that, we need to watch 
  // for the ready event. When the API is ready, then the `FB` global object is ready to go !
  // The Facebook module is a wrapper for the `FB` object.
  $scope.$watch(function() {
    return Facebook.isReady() ;
  }, function(newVal) {
      if(Facebook.isReady()) {
        // initially checks to see if the user is logged in.
        Auth.setUser(!!FB.getUserID() === true)
        $scope.isLoggedin = Auth.isLoggedIn();
        Auth.setLoginPic(function(pic) {  $scope.myPicture = (!!FB.getUserID() === true) ? ( pic) : (0)});
        // finally app is loaded.
        $scope.isAppLoaded = true;
        
      }
  });

  // Control for authentication routing. Let users go to dashboard only if they are logged in.
  $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
    if(!value && oldValue) { $location.path('/')}
    // if(value) { $location.path("/dashboard")  }
  }, true);


  // Everytime route changes test and see if we are on the homepage.
    $rootScope.$on('$routeChangeStart', function () {
      $scope.isHome = ($location.url() == "/") ? (true) : (false);  
    });

    // checking on routeprams
    $scope.$on('$routeChangeSuccess', function() {
      // Auth.setActivePage( $location.url() );
      $scope.activePage = $location.url().substring(1, $location.url().length);
    });
    
  
}])
// Higher level controller for the dashboard.
.controller("DashboardCtrl", [ "$rootScope","$scope", "$http", "$q", "Facebook", "Auth", function ($rootScope, $scope, $http, $q, Facebook, Auth) {
  // catching routeparams
    
  // get list of my facebook friends.
  Auth.runQuery("/me", function(d){ $scope.me = d});
  // get list of friends.
  Auth.runQuery("/me/friends", function(d){ $scope.myFriends = d.data});
  // get friends books.
  $scope.friendsBooks = [];
  Auth.runQuery("/me/friends", function(friends){ 
    friends.data.forEach(function (f) {
      Auth.runQuery("/"+f.id+"/books", function(books){ 
        books.data.forEach(function (b) {
          Auth.runQuery("/"+b.id, function(page){ 
            $scope.friendsBooks.push({
              book: b,
              friend: f,
              bookPage: page
            });
          })
        });
      })
    });
  });

  
  
  // ajax call to get my facebook photo.
  $scope.getPhoto = function() {
    $q.all([$http({method: "GET",url: "http://graph.facebook.com/322331021276495/photos"})
      ]).then(function(response) {
        $scope.photos = response[0].data;
      })
    }

    // ask permission for accessing user likes
    // see what your friends are up to ...
    $scope.askForLikes = function () {
      FB.login(function(response) {
      }, {scope: 'email,user_likes,user_friends'});
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
        Auth.setLoginPic(function(pic) {$scope.myPicture = pic})
        // redirect to dashboard on login.
        $location.url("/dashboard")
      } else {
        // log in wasn't successful ...
        Auth.setUser(false);
        $scope.isLoggedin = Auth.isLoggedIn();
        $scope.myPicture = 0;
      }
    });
  };
  // logout the user from the app (and facebook)
  $scope.logout = function () {
    Facebook.logout(function(response) {
      console.log("logged out");
      Auth.setUser(false);
      $scope.isLoggedin = Auth.isLoggedIn();
      $scope.myPicture = 0;
      $location.url("/");
    });
  };
}])

// Profile.
.controller("ProfileCtrl",["$scope", "Auth", function ($scope, Auth) {
  Auth.runQuery("/me", function(res){ $scope.me  = res });
}])

// books
.controller("BooksCtrl",["$scope", "Auth", "$q","$http","$timeout", function ($scope, Auth, $q, $http, $timeout) {
  // Getting the list of books asynchronously by calling the REST API from MYSQL
    // Express takes care of the rest after the SQL query is run with node.
    $scope.isBooksReady = false;
    $q.all([$http({method: "GET",url: "/books"})
    ]).then(function(response) {$scope.books = response[0].data; $timeout(function () {$scope.isBooksReady = true},500)});
}])