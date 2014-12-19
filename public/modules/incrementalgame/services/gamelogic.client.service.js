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
          price: 15,
          description: 'The 1st worker, gain 1 item per sec',
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