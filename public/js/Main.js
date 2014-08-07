angular.module('MainApp', ['ui.bootstrap','ModuleOne', 'ngRoute', 'ngResource', 'facebook'])

.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Auth.isLoggedIn()) {
            event.preventDefault();
            $location.path('/');
        }
        else {
            console.log('ALLOW');
            // $location.path('/dashboard');
        }
    });
}])

.config(['$routeProvider', function($routeProvider) { $routeProvider
	.when('/', { templateUrl:"home.htm" })
	.when('/404', { templateUrl:"404.htm" })
	.when('/dashboard', { templateUrl:"dashboard.htm" })
	.otherwise({redirectTo:'/404'});
}])

// settings for the facebook api.
.config(function(FacebookProvider) {
  FacebookProvider.init('271344089723884');
})
