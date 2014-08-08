angular.module('MainApp', ['ui.bootstrap','MainModule', 'ngRoute', 'ngResource', 'facebook','ngAnimate'])

// settings for the facebook api.
.config(["FacebookProvider", function (FacebookProvider) {
	// test user: john_cwsuaie_user@tfbnw.net
	
	var facebookAppID = '271344089723884';
  FacebookProvider.init(facebookAppID);
}])

// control the state of the logged in user (checks if logged in or not)
// TODO: This could go to the main controller...
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {
	    if (!Auth.isLoggedIn()) {
	      event.preventDefault();
	      $location.path('/');
	    }
	    else {
	      console.log('Accessible');
	      // $location.path('/dashboard');
	    }
    });
}])

// Set the routes
.config(['$routeProvider', function($routeProvider) { $routeProvider
	.when('/', { templateUrl:"home.htm" })
	.when('/dashboard', { templateUrl:"dashboard.htm" })
	.when('/404', { templateUrl:"404.htm" })
	.otherwise({redirectTo:'/404'});
}])