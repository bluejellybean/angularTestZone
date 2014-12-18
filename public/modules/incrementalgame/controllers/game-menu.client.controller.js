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
