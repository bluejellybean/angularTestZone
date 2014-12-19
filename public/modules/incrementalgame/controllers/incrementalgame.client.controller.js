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