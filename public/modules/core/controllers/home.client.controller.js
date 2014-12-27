'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Menu',
	function($scope, Authentication, Menu) {
		// This provides Authentication context.
		this.menu = Menu.getMenu('topbar');
		this.authentication = Authentication;
	}
]);
