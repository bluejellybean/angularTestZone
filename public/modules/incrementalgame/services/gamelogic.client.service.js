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