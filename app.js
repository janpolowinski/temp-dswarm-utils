'use strict';

var baseUrlBackend = 'http://194.95.142.135/dmp/';
//var baseUrlBackend = 'http://sdvdmpdev.slub-dresden.de/dmp/';
//var baseUrlBackend = 'http://sdvdswarmpro.slub-dresden.de/dmp/';
//var baseUrlBackend = 'http://sdvdmppro.slub-dresden.de/dmp/';
// ?format=medium ?format=medium ?format=full (default)
//var baseUrlBackend = 'http://dswarmtest01.slub-dresden.de/dmp/';

function parseFilterExpressions(projects) {
	
	for (let project of projects) { // 'for i of var' iterates the values, for .. in .. iterates the keys instead (ECMA 2015) https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/for...of#Browser_compatibility 
//	   console.log(project); 
	   for (let mapping of project.mappings) {
//		   console.log(mapping);
		   for (let iap of mapping.input_attribute_paths) {
//			   console.log(iap);
			   if (iap.filter!=null && iap.filter.expression!=null) {
//				   console.log(iap.filter.expression);
				   var parsedFilterExpression = jQuery.parseJSON(iap.filter.expression);
//				   console.log(parsedFilterExpression);
				   iap.filter.expression=parsedFilterExpression;
//				   console.log(iap.filter.expression);
			   }
		   }
	   }
		   
		}
	return projects;
}




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
      },
      
      getFilterExpression: function(imapi) {
    	  var expressionString;
    	  var expression = null;
    	  if (imapi.filter!=null && imapi.filter.expression!=null) {
    		  expressionString = imapi.filter.expression;
//    		  expression = {"type" : "test", "expression" : "expression"};
    		  expression = jQuery.parseJSON(expressionString);
//    		  alert(expression.type);
    	  }
    	  return expression;
      },

      getTagValueFromFilter: function(expressionString) {
    		if (null!=expressionString) {
    		    var re = /^.*#tag":"([^"]*)"\}.*/; 
    		    var matches = expressionString.match(re);
    	        if (matches == null) return "";
    	        else return matches[1];
    		} else return "";
       },
    	
       getCodeValueFromFilter: function (expressionString) {
    		if (null!=expressionString) {
    		    var re = /^.*#code":"([^"]*)"\}.*/; 
    		    var matches = expressionString.match(re);
    	        if (matches == null) return "";
    	        else return matches[1];
    		} else return "";
    	},

    	getIDValueFromFilter: function (expressionString) {
    		if (null!=expressionString) {
    		    var re = /^.*#id":"([^"]*)"\}.*/; 
    		    var matches = expressionString.match(re);
    	        if (matches != null) return " !!!!!!!!!!!!! ID was used somewhere in Filter! Intentionally? !!!!!!!!!!!!!!!!";
    	        else return "";
    		} else return "";
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
      $scope.projects = parseFilterExpressions(response.data);
      $scope.mappingTable = MappingTable;
    });
  })
  .controller('MappingTableCtrl', function($scope, MappingTable){
    $scope.mappingTable = MappingTable;
  });
  
  ;