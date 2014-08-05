angular.module('MainApp', ['ui.bootstrap','ModuleOne', 'ngRoute'])
.config(['$routeProvider', function($routeProvider) { $routeProvider
	.when('/', { templateUrl:"template.htm" })
	.when('/404', { templateUrl:"404.htm" })
	.when('/dashboard', { templateUrl:"randomfile.htm" })
	.otherwise({redirectTo:'/404'});
}])
