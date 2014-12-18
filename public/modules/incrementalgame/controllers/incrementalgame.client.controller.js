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
          price: 50,
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
      },
      {
        worker: {
          name: 'worker 3',
          price: 100,
          description: 'was the first worker, gain 3 item per sec',
        },
        upgrade: [
          {
            name: 'upgradeTier3 #1',
            price: 50,
            description: 'Was the first upgrade, x2 worker1 production'
          },
          {
            name: 'upgradeTier3 #2',
            price: 100,
            description: 'Was the second upgrade, x4 worker1 production'
          }
        ]
      },
      {
      worker: {
          name: 'worker 4',
          price: 500,
          description: 'was the first worker, gain 3 item per sec',
        },
        upgrade: [
          {
            name: 'upgradeTier4 #1',
            price: 50,
            description: 'Was the first upgrade, x2 worker1 production'
          },
          {
            name: 'upgradeTier4 #2',
            price: 100,
            description: 'Was the second upgrade, x4 worker1 production'
          }
        ]
      },
      {
        worker: {
          name: 'worker 5',
          price: 1000,
          description: 'was the first worker, gain 3 item per sec',
        },
        upgrade: [
          {
            name: 'upgradeTier5 #1',
            price: 50,
            description: 'Was the first upgrade, x2 worker1 production'
          },
          {
            name: 'upgradeTier5 #2',
            price: 100,
            description: 'Was the second upgrade, x4 worker1 production'
          }
        ]
      },
    ];

    this.userInfo = Gamelogic.getUserInformation();
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
    
    
    
    // Run UI update code every 1000ms
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
        } else if ( key === 2 ) {
          workerCount = Gamelogic.getWorkerCount(key);
          increaseValue = workerCount * 25;
          Gamelogic.increaseMoneyBy(increaseValue);
        } else if ( key === 3 ) {
          workerCount = Gamelogic.getWorkerCount(key);
          increaseValue = workerCount * 50;
          Gamelogic.increaseMoneyBy(increaseValue);
        } else if ( key === 4 ) {
          workerCount = Gamelogic.getWorkerCount(key);
          increaseValue = workerCount * 75;
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
