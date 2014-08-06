angular.module('ModuleOne', [])

.controller("MainCtrl", function ($scope, $http, $resource, $q) {
  $scope.main = "Main from module controller ...";
})

.controller("DashboardCtrl", function ($scope, $http, $resource, $q, $timeout) {
  $q.all([$http({method: "GET",url: "/books"})
  ]).then(function(response) {$scope.books = response[0].data;});
 })