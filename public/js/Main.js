angular.module('MainApp', ['ui.bootstrap','ModuleOne', 'ngRoute', 'ngResource', 'facebook'])
.config(['$routeProvider', function($routeProvider) { $routeProvider
	.when('/', { templateUrl:"template.htm" })
	.when('/404', { templateUrl:"404.htm" })
	.when('/dashboard', { templateUrl:"dashboard.htm" })
	.otherwise({redirectTo:'/404'});
}])

.config(function(FacebookProvider) {
  FacebookProvider.init('271344089723884');
})
