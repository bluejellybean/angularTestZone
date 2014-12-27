'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider
		.state('home', {
			url: '/',
			controller: 'HomeController as home',
			templateUrl: 'modules/core/views/home.client.view.html'
		})

		.state('about', {
			url: '/about',
			controller: 'HeaderController as hee',
			templateUrl: 'modules/core/views/about.client.view.html'
		});
	}
]);