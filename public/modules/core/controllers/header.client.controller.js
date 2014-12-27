'use strict';

/*angular.module('core').controller('HeaderController', ['$scope',
	function() {

	}]);*/

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;


		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}

]);