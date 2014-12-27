'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'alexblog';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate', 'ngTouch', 'ngSanitize',  'ui.router', 'ui.utils']; //'ui.bootstrap'

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('blogs');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('incrementalgame');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('blogs')
.run(["$rootScope", "$state", "Authentication", function($rootScope, $state, Authentication) {

	$rootScope.$on('$stateChangeStart', function(e, to) {

		if (angular.isObject(to.data) && !Authentication.user) {// dataStore.valid == false) {
			e.preventDefault();
			$state.go('signin');
		}
	});
}])
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
'use strict';

// Blogs controller
angular.module('blogs').controller('BlogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Blogs',
	function($scope, $stateParams, $location, Authentication, Blogs) {
		$scope.authentication = Authentication;

		// Create new Blog
		$scope.create = function() {
			// Create new Blog object
			var blog = new Blogs ({
				name: this.name,
				content: this.content
			});

			// Redirect after save
			blog.$save(function(response) {
				$location.path('blogs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Blog
		$scope.remove = function(blog) {
			if ( blog ) { 
				blog.$remove();

				for (var i in $scope.blogs) {
					if ($scope.blogs [i] === blog) {
						$scope.blogs.splice(i, 1);
					}
				}
			} else {
				$scope.blog.$remove(function() {
					$location.path('blogs');
				});
			}
		};

		// Update existing Blog
		$scope.update = function() {
			var blog = $scope.blog;

			blog.$update(function() {
				$location.path('blogs/' + blog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Blogs
		$scope.find = function() {
			$scope.blogs = Blogs.query();
		};

		// Find existing Blog
		$scope.findOne = function() {
			$scope.blog = Blogs.get({ 
				blogId: $stateParams.blogId
			});
		};
	}
]);
'use strict';

//Blogs service used to communicate Blogs REST endpoints
angular.module('blogs').factory('Blogs', ['$resource',
	function($resource) {
		return $resource('blogs/:blogId', { blogId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Menu',
	function($scope, Authentication, Menu) {
		// This provides Authentication context.
		this.menu = Menu.getMenu('topbar');
		this.authentication = Authentication;
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menu', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').directive('modalDialog', [
	function() {
	  return {
      restrict: 'E',
      scope: {
        show: '='
      },
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
        scope.hideModal = function() {
          scope.show = false;
        };
      },
    
      template:'<div class="ng-modal" ng-show="show"><div class="ng-modal-overlay" ng-click="hideModal()"></div><div class="ng-modal-dialog" ng-style="dialogStyle"><div class="ng-modal-close" ng-click="hideModal()">X</div><div class="ng-modal-dialog-content" ng-transclude></div></div></div>'

    };
	}
]);
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
'use strict';

angular.module('incrementalgame').controller('GameMenuController', ['Gamelogic',
	function(Gamelogic) {


    this.modalShown = false;
    this.toggleModal = function() {
      this.modalShown = !this.modalShown;
    };

    
    this.invertedState = Gamelogic.getInvertState();


    this.saveGame = function() {

      Gamelogic.saveUserInformation();

    };

    this.loadGame = function() {

      Gamelogic.loadUserInformation();

    };


    this.resetGame = function() {

      Gamelogic.resetUserInformation();

    };

   	this.invertColors = function () {
   		
   		if ( this.invertedState === 'default' ) {

   			this.invertedState = 'inverted';
   		} else {

   			this.invertedState = 'default';
   		}

   		Gamelogic.flipInvertState();
	};
}]);
'use strict';

angular.module('incrementalgame').controller('IncrementalgameController', ['$scope', '$interval', 'Gamelogic',
 function($scope, $interval, Gamelogic) {



    this.userInfo = Gamelogic.getUserInformation();
    
    this.totalWorkers = Gamelogic.getTotalWorkers();
    
    var Tiers = Gamelogic.getTiers();
    this.level = Tiers;

    

    this.increaseTotalClicks = function() {
      Gamelogic.increaseTotalClicksByOne();
    };

/*    this.getClickCount = function() {
      return GameLogic.getClickCount();
    };*/

    // Increase money every time produce-widget is clicked
    this.produceWidget = function() {
      Gamelogic.increaseMoneyBy(1);
    };

    this.getWorkerCost = function(tier) {
        
      return Tiers[tier].worker.price;
    };

    this.getUpgradeLevel = function(tier) {

      return Gamelogic.getUpgradeLevel(tier);
    };

    this.getUpgradeCost = function(tier) {

      var upgradeLevel = Gamelogic.getUpgradeLevel(tier);
      //this is bad in here, the 2 should be more geared to the total number of upgrades
      if ( upgradeLevel < 2 ) {
        
        return Tiers[tier].upgrade[upgradeLevel].price;
      
      } else {
      
        return 9007199254740992;
      
      }
    };

    this.getMoney = function(){

      return Gamelogic.getCurrentMoney();
    };

    this.buyWorker = function(tier) {

        Gamelogic.decreaseMoneyBy( Tiers[tier].worker.price );
        Gamelogic.increaseWorkerCount( tier );


        //TODO: increase cost per worker

      };

    this.buyUpgrade = function(tier) {

      Gamelogic.decreaseMoneyBy( Tiers[tier].upgrade[0].price );
      Gamelogic.increaseUpgradeLevel( tier );
    };

    
    // Run UI update code every 1000ms
    var gameTick = $interval(function() {



      var workers = Gamelogic.getUserInformation();
      workers = workers.workers;

      var workerCount = '';
      var upgradeLevel = '';
      var baseProduction = '';

      var increaseValue = '';

      angular.forEach(workers, function(value, key) {

          upgradeLevel = Gamelogic.getUpgradeLevel(key);
          workerCount = Gamelogic.getWorkerCount(key);
          baseProduction = Gamelogic.getBaseProduction(key);

          if ( upgradeLevel > 0 ) {

            increaseValue = baseProduction * workerCount * upgradeLevel * 2;
          
          } else {
            
            increaseValue = baseProduction * workerCount;
          
          }
          
          Gamelogic.increaseMoneyBy(increaseValue);

      });

    }, 1000);
    //stop gameTick
    $scope.$on('$destroy', function () {
      $interval.cancel(gameTick);
    });

  }
]);
'use strict';

angular.module('incrementalgame').factory('Gamelogic', [
  function() {

    var clickAPI = {};

    var UserInformation = {

      currentMoney: 0,
      workers: [0,0,0,0,0],
      upgrades: [0,0,0,0,0,],
      totalClicks: 0,
      settings: {
        color: 'default'
      }

    };

    var TotalWorkers = {
      count: 0
    };

    clickAPI.getTotalWorkers = function() {

      return TotalWorkers;
    };


    clickAPI.findTotalWorkerCount = function() {
      var workerCount = 0;
      
      angular.forEach(UserInformation.workers, function(value, key) {
          workerCount = workerCount += value;
      });
      
      TotalWorkers.count = workerCount;
      return TotalWorkers;
    };

    clickAPI.increaseTotalClicksByOne = function() {
      UserInformation.totalClicks = UserInformation.totalClicks + 1;
    };


    clickAPI.saveUserInformation = function() {
      
      var UserInformationToSave = JSON.stringify(UserInformation);
      UserInformationToSave = btoa(UserInformationToSave);

      localStorage.setItem('userInfoObject', JSON.stringify(UserInformationToSave));


    };

    clickAPI.loadUserInformation = function () {


      var retrievedObject = localStorage.getItem('userInfoObject');

      if ( typeof retrievedObject !== 'undefined' && retrievedObject !== null ) { 
        retrievedObject = JSON.parse(retrievedObject); 

        var loadedUserInformation = atob(retrievedObject);
        
        loadedUserInformation = JSON.parse(loadedUserInformation);

        this.resetUserInformation();

        UserInformation.currentMoney = loadedUserInformation.currentMoney;
        UserInformation.workers = loadedUserInformation.workers;
        UserInformation.upgrades = loadedUserInformation.upgrades;
        UserInformation.settings.color = loadedUserInformation.settings.color;

        this.findTotalWorkerCount();
      } else {
        //TODO: display this is a more clear way OR just gray out the load button until availabe
        console.log('can\'t load item!');
      }
    };

    clickAPI.getInvertState = function() {
      return UserInformation.settings.color;
    };

    clickAPI.flipInvertState = function() {

      if (UserInformation.settings.color === 'default') {
        UserInformation.settings.color = 'inverted';
      } else {
        UserInformation.settings.color = 'default';
      }
      
    };

    clickAPI.resetUserInformation = function () {

      UserInformation.currentMoney = 0;
      UserInformation.workers = [0,0,0,0,0];
      UserInformation.upgrades = [0,0,0,0,0];
      UserInformation.settings.color = 'default';

    };

    clickAPI.getUserInformation = function() {

      return UserInformation;
    };

    clickAPI.getCurrentMoney = function() {
      return UserInformation.currentMoney;
    };

    clickAPI.getWorkerCount = function(workerNumber) {

      return UserInformation.workers[workerNumber];
    
    };

    clickAPI.getUpgradeLevel = function(upgradeNumber) {

      return UserInformation.upgrades[upgradeNumber];
    
    };

    clickAPI.getBaseProduction = function(tierNumber) {
      return Tiers[tierNumber].worker.baseProduction;
    };

    clickAPI.increaseMoneyBy = function(moneyValue) {
      
      UserInformation.currentMoney += moneyValue;
    
    };

    clickAPI.decreaseMoneyBy = function(moneyValue) {
    
      UserInformation.currentMoney -= moneyValue;
    
    };

    clickAPI.increaseWorkerCount = function(workerNumber) {
      
      TotalWorkers.count += 1;
      UserInformation.workers[workerNumber] += 1;
    
    };

    clickAPI.increaseUpgradeLevel = function(upgradeNumber) {
      
      UserInformation.upgrades[upgradeNumber] += 1;

    };

    clickAPI.getTiers = function() {
      return Tiers;
    };

    var Tiers = [
    
      //TIER ONE
      {
        worker: {
          name: 'worker 1',
          price: 1,
          description: 'The 1st worker, gain 1 item per sec',
          baseProduction: 1
        },
        upgrade: [
          {
            name: 'upgradeTier1 #1',
            price: 50,
            description: 'The 1st upgrade, x2 worker 1 production'
          },
          {
            name: 'upgradeTier1 #2',
            price: 100,
            description: 'The 2nd upgrade, x4 worker 1 production'
          }
        ]
      },
      //TIER TWO
      {
        worker: {
          name: 'worker 2',
          price: 50,
          description: 'The first worker, gain 100 item per sec',
          baseProduction: 100
        },
        upgrade: [
          {
            name: 'upgradeTier2 #1',
            price: 500,
            description: 'The 1st upgrade, x2 worker 2 production'
          },
          {
            name: 'upgradeTier2 #2',
            price: 1000,
            description: 'The 2nd upgrade, x4 worker 2 production'
          }
        ]
      },
      //TIER THREE
      {
        worker: {
          name: 'worker 3',
          price: 2000,
          description: 'The first worker, gain 2000 item per sec',
          baseProduction: 500
        },
        upgrade: [
          {
            name: 'upgradeTier3 #1',
            price: 5000,
            description: 'The 1st upgrade, x2 worker 3 production'
          },
          {
            name: 'upgradeTier3 #2',
            price: 10000,
            description: 'The 2nd upgrade, x4 worker 3 production'
          }
        ]
      },
      //TIER FOUR
      {
        worker: {
          name: 'worker 4',
          price: 10000,
          description: 'The 4th worker, gain 10000 item per sec',
          baseProduction: 1000
        },
        upgrade: [
          {
            name: 'upgradeTier4 #1',
            price: 20000,
            description: 'The 1st upgrade, x2 worker 4 production'
          },
          {
            name: 'upgradeTier4 #2',
            price: 40000,
            description: 'The 2nd upgrade, x4 worker 4 production'
          }
        ]
      },
      //TIER FIVE
      {
        worker: {
          name: 'worker 5',
          price: 100000,
          description: 'The 5th worker, gain 100000 item per sec',
          baseProduction: 2000
        },
        upgrade: [
          {
            name: 'upgradeTier5 #1',
            price: 200000,
            description: 'The 1st upgrade, x2 worker 5 production'
          },
          {
            name: 'upgradeTier5 #2',
            price: 400000,
              description: 'The 2nd upgrade, x4 worker 5 production'
          }
        ]
      },

    ];
    return clickAPI;
  }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
//		state('password', {
	//		url: '/settings/password',
	//		templateUrl: 'modules/users/views/settings/change-password.client.view.html'
	//	}).
	//	state('accounts', {
	//		url: '/settings/accounts',
//			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
	//	}).
	//	state('signup', {
	//		url: '/signup',
	//		templateUrl: 'modules/users/views/authentication/signup.client.view.html'
	//	}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		});
/*		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});*/
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;
		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);