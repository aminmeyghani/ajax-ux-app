angular.module('MainApp', ['ui.bootstrap','MainModule', 'ngRoute', 'ngResource', 'facebook','ngAnimate', 'angularSmoothscroll'])

// settings for the facebook api.
.config(["FacebookProvider", function (FacebookProvider) {
	// test user: john_cwsuaie_user@tfbnw.net
  var facebookAppID = '271344089723884';
  FacebookProvider.init(facebookAppID);
}])

// control the state of the logged in user (checks if logged in or not)
// TODO: This could go to the main controller...
.run(['$rootScope', '$location', 'Auth', 'Facebook', function ($rootScope, $location, Auth, Facebook) {
  $rootScope.$on('$routeChangeStart', function (event) {
    
    // Auth.setActivePage( $location.url() );
  	Facebook.getLoginStatus(function(response){
  	  if (!Auth.isLoggedIn()) {
  	    event.preventDefault();
  	    $location.url('/');
  	  }
  	  else {
  	    console.log('Accessible');
  	    // $location.path('/dashboard');
  	  }
  	})
  });
}])

// Set the routes
.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
   $routeProvider
	.when('/', { templateUrl:function (params) {return "home.htm"} })
	.when('/library', { templateUrl:function (params) { return "library.htm"} })
	.when('/profile', { templateUrl:function (params) {return "profile.htm"} })
  .when('/books', { templateUrl:function (params) {return "books.htm"} })
	.when('/404', { templateUrl:"404.htm" })
	.otherwise({redirectTo:'/404'});
}])