'use strict';

//var baseUrlBackend = 'http://194.95.142.135/dmp/';
//var baseUrlBackend = 'http://sdvdmpdev.slub-dresden.de/dmp/';
//var baseUrlBackend = 'http://sdvdswarmpro.slub-dresden.de/dmp/';
var baseUrlBackend = 'http://sdvdmppro.slub-dresden.de/dmp/';
// ?format=medium ?format=medium ?format=full (default)


angular.module('dswarmBackstageApp', ['ngAnimate', 'ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: 'datamodels.html' })
      .when('/datamodels', { templateUrl: 'datamodels.html' })
      .when('/projects', { templateUrl: 'projects.html' })
      .when('/about', { template: 'Utilities not yet part of the D:SWARM Backoffice (Frontend)' })
      .otherwise({ redirectTo: '/'});
  })
  .factory('MappingTable', function() {
    var project = null;
    return {
      getMappings: function() {
    	if(project!=null)
    		return project.mappings;
    	else
    		return [];
      },
      setProject: function(currentProject) {
        project = currentProject;
      },
      getProject: function() {
          return project;
        }
    };
  })
  .controller('DatamodelsCtrl', function($scope, $http){
    $http.get(baseUrlBackend + 'datamodels?format=short').then(function(response) {
      $scope.datamodels = response.data;
    });
  })
  .controller('ProjectsCtrl', function($scope, $http, MappingTable){
    $http.get(baseUrlBackend + 'projects?format=medium').then(function(response) {
      $scope.projects = response.data;
      $scope.mappingTable = MappingTable;
    });
  })
  .controller('MappingTableCtrl', function($scope, MappingTable){
    $scope.mappingTable = MappingTable;
  });
  
  ;
