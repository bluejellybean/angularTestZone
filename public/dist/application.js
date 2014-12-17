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

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('incrementalgame');

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
			templateUrl: 'modules/core/views/home.client.view.html'
		})

		.state('about', {
			url: '/about',
			templateUrl: 'modules/core/views/about.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Menus',
	function($scope, Authentication, Menus) {
		
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController');
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
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
   		
   		if ( this.invertedState == "default" ) {

   			this.invertedState = "inverted";
   		} else {

   			this.invertedState = "default"
   		}

   		Gamelogic.flipInvertState();
	};
}]);

'use strict';

angular.module('incrementalgame').controller('IncrementalgameController', ['$scope', '$interval', 'Gamelogic',
 function($scope, $interval, Gamelogic) {

    var Tiers = [
      {
        worker: {
          name: 'worker 1',
          price: 15,
          description: 'was the first worker, gain 1 item per sec',
        },
        upgrade: [
          {
            name: 'upgradeTier1 #1',
            price: 50,
            description: 'Was the first upgrade, x2 worker1 production'
          },
          {
            name: 'upgradeTier1 #2',
            price: 100,
            description: 'Was the second upgrade, x4 worker1 production'
          }
        ]
      },
      {
        worker: {
          name: 'worker 2',
          price: 15,
          description: 'was the first worker, gain 5 item per sec',
        },
        upgrade: [
          {
            name: 'upgradeTier2 #1',
            price: 500,
            description: 'Was the first upgrade, x2 worker2 production'
          },
          {
            name: 'upgradeTier2 #2',
            price: 1000,
            description: 'Was the second upgrade, x4 worker2 production'
          }
        ]
      }
    ];

    this.userInfo = Gamelogic.getUserInformation();
    this.level = Tiers;

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

      return Tiers[tier].upgrade[upgradeLevel].price;
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
    
    
    
    // Run UI update code every 10ms
    var gameTick = $interval(function() {

      var workers = Gamelogic.getUserInformation();
      workers = workers.workers;

      var workerCount = '';
      var increaseValue = '';
      //this is silly in here
      angular.forEach(workers, function(value, key) {
        
        if( key === 0 ) {
          workerCount = Gamelogic.getWorkerCount(key);
          increaseValue = workerCount * 1;
          Gamelogic.increaseMoneyBy(increaseValue);
        } else if ( key === 1 ) {
          workerCount = Gamelogic.getWorkerCount(key);
          increaseValue = workerCount * 5;
          Gamelogic.increaseMoneyBy(increaseValue);
        }
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

    var UserInformation= {

      currentMoney: 0,
      workers: [0,0],
      upgrades: [0,0],
      settings: {
        color: 'default'
      }

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
      } else {
        //TODO: display this is a more clear way OR just gray out the load button until availabe
        console.log("can't load item!");
      }
    };

    clickAPI.getInvertState = function() {
      return UserInformation.settings.color;
    };

    clickAPI.flipInvertState = function() {

      if (UserInformation.settings.color == 'default') {
        UserInformation.settings.color = 'inverted';
      } else {
        UserInformation.settings.color = 'default';
      }
      
    }

    clickAPI.resetUserInformation = function () {

      UserInformation.currentMoney = 0;
      UserInformation.workers = [0, 0];
      UserInformation.upgrades = [0, 0];
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

    clickAPI.increaseMoneyBy = function(moneyValue) {
      
      UserInformation.currentMoney += moneyValue;
    
    };

    clickAPI.decreaseMoneyBy = function(moneyValue) {
    
      UserInformation.currentMoney -= moneyValue;
    
    };

    clickAPI.increaseWorkerCount = function(workerNumber) {

      UserInformation.workers[workerNumber] += 1;
    
    };

    clickAPI.increaseUpgradeLevel = function(upgradeNumber) {
      
      UserInformation.upgrades[upgradeNumber] += 1;

    };

    return clickAPI;
	}
]);