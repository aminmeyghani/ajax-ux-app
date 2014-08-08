angular.module('MainModule', [])

// service to keep track of the state of the user.
.service('Auth', function(Facebook){
  var user;
  var my = {};
  return{
    setUser : function(aUser) {
      user = aUser;
    },
    isLoggedIn : function(){
      return(user)? user : false;
    },
    setMy: function (attr, val) {
      my[attr] = val;
    },
    getMy: function (attr) {
      return my[attr]
    },
    getMe: function () {return my },
    // wrapper for the fb api in a service so that it's always loaded !
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
    }
    // raw query set up for getting friends books
    /*
      var friendsBooks = [];
      FB.api("me/friends", function(friends) {
        if (friends && !friends.error) {
          friends.data.forEach(function(f) {
            FB.api(f.id + "/books", function(books) {
              if (books && !books.error) {
                books.data.forEach(function(b) {
                  FB.api("/"+b.id, function(page) {
                    if (page && !page.error) {
                      friendsBooks.push({
                        friend: f,
                        book: b,
                        bookPage: page
                      });
                      console.log(friendsBooks)
                    }
                  })
                });
              }
            });
          });
        }
      });
    */
    // test ajax request for my fb photos
    // get a user's picture.
    // graph.facebook.com/345157298969677/picture?type=large
    /*
    call with token
    https://graph.facebook.com/me?access_token=ACCESS_TOKEN


    // get friends
    https://graph.facebook.com/me/friends?access_token=CAAD2yTgUcZBwBABA03aZC0hd4q5n009wg9sJUCdKwsYpIPApqxhZAWFgzaa3Jji9XXhj8SBa23qn5zbKCRiK70O5zj01qn7Pv8CZBp5sWF33hLDs1Ye2tt99i3mGlrzbTkGXxZBAzAezNoUF6W1Sv3WNaSW49DM9nuax7VsFIoMV8GE01uio6RuZAbjpTDuzta6g4pOr6ShHNJeIhDUPCe

    // getting friends likes
    FB.api("/likes?ids=533856945,841978743")
    FB.api("me/friends",{
      fields:'id',
      limit:10
    },function(res){
      var l=''
      $.each(res.data,function(idx,val){
         l=l+val.id+(idx<res.data.length-1?',':'')
      })
      FB.api("likes?ids="+l,function(res){
          console.log(res);
      })
    })

    */
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
    return Facebook.isReady() ;
  }, function(newVal) {
      if(Facebook.isReady()) {
        // initially checks to see if the user is logged in.
        Auth.setUser(!!FB.getUserID() === true)
        $scope.isLoggedin = Auth.isLoggedIn();
        // finally app is loaded.
        $scope.isAppLoaded = true;
        //
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
}])
// Higher level controller for the dashboard.
.controller("DashboardCtrl", [ "$scope", "$http", "$q", "Facebook", "Auth", function ($scope, $http, $q, Facebook, Auth) {
  // get list of my facebook friends.
  Auth.runQuery("/me", function(d){ $scope.me = d});
  Auth.runQuery("/me/friends", function(d){ $scope.myFriends = d.data});

  // Getting the list of books asynchronously by calling the REST API from MYSQL
  // Express takes care of the rest after the SQL query is run with node.
  $q.all([$http({method: "GET",url: "/books"})
  ]).then(function(response) {$scope.books = response[0].data;});
  
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

// controller for another page ...
.controller("RandomCtrl",["$scope", "Auth", function ($scope, Auth) {
  Auth.runQuery("/me/friends", function(friends){ $scope.myFriends  = friends.data});
}])