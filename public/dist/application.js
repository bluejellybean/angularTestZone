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
			controller: 'HeaderController as hee',
			templateUrl: 'modules/core/views/about.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope',
	function() {

	}]);

'use strict';


angular.module('core').controller('HomeController');
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
    template:"<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"

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
      console.log('toggle');
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

    var UserInformation= {

      currentMoney: 0,
      workers: [0,0,0,0,0],
      upgrades: [0,0,0,0,0,],
      totalClicks: 0,
      settings: {
        color: 'default'
      }

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
          price: 100,
          description: 'The first worker, gain 500 item per sec',
          baseProduction: 500
        },
        upgrade: [
          {
            name: 'upgradeTier3 #1',
            price: 50,
            description: 'The 1st upgrade, x2 worker 3 production'
          },
          {
            name: 'upgradeTier3 #2',
            price: 100,
            description: 'The 2nd upgrade, x4 worker 3 production'
          }
        ]
      },
    //TIER FOUR
      {
        worker: {
          name: 'worker 4',
          price: 500,
          description: 'The 4th worker, gain 1000 item per sec',
          baseProduction: 1000
        },
        upgrade: [
          {
            name: 'upgradeTier4 #1',
            price: 50,
            description: 'The 1st upgrade, x2 worker 4 production'
          },
          {
            name: 'upgradeTier4 #2',
            price: 100,
            description: 'The 2nd upgrade, x4 worker 4 production'
          }
        ]
      },
    //TIER FIVE
      {
        worker: {
          name: 'worker 5',
          price: 1000,
          description: 'The 5th worker, gain 1500 item per sec',
          baseProduction: 1500
        },
        upgrade: [
          {
            name: 'upgradeTier5 #1',
            price: 50,
            description: 'The 1st upgrade, x2 worker 5 production'
          },
          {
            name: 'upgradeTier5 #2',
            price: 100,
              description: 'The 2nd upgrade, x4 worker 5 production'
          }
        ]
      },

    ];
    return clickAPI;
	}
]);