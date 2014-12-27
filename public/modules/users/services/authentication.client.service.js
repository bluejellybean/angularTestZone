'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;
		console.log('this',window.user)
		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);