'use strict';

//Setting up route
angular.module('blogs')
.run(function($rootScope, $state, Authentication) {

	$rootScope.$on('$stateChangeStart', function(e, to) {

		if (angular.isObject(to.data) && !Authentication.user) {// dataStore.valid == false) {
			e.preventDefault();
			$state.go('signin');
		}
	});
})
.config(['$stateProvider',
	function($stateProvider) {
		// Blogs state routing
		$stateProvider.
		state('listBlogs', {
			url: '/blogs',
			templateUrl: 'modules/blogs/views/list-blogs.client.view.html'
		}).
		state('createBlog', {
			url: '/blogs/create',
			templateUrl: 'modules/blogs/views/create-blog.client.view.html',
		    //to check for auth
		    data: {}
		}).
		state('viewBlog', {
			url: '/blogs/:blogId',
			templateUrl: 'modules/blogs/views/view-blog.client.view.html'
		}).
		state('editBlog', {
			url: '/blogs/:blogId/edit',
			templateUrl: 'modules/blogs/views/edit-blog.client.view.html',
		    //to check for auth
		    data: {}
		});
	}
]);