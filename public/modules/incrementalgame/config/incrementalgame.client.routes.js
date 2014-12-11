'use strict';

//Setting up route
angular.module('incrementalgame').config(['$stateProvider',
	function($stateProvider) {
		// Inincrementalgame state routing
		
		$stateProvider.
		state('incrementalgame', {
			url: '/incrementalgame',
			controller: 'IncrementalgameController as click',
			templateUrl: 'modules/incrementalgame/views/incrementalgame.client.view.html'
		});
	}
]);