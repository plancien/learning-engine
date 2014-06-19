define(['event_bus', 'game_types/frogAdventure/config'], 
function(eventBus, config){
	var BonusManageur = function(game){
		this.bonusImageName = [];
		this.malusImageName = [];
		for (var i = game.params.bonus.length - 1; i >= 0; i--) { //On ajoute les images bonus et malus dans le moteur de rendue
			var imageName = "bonus"+i;
			var imageUrl = game.params.bonus[i];
			game.cameraRender.addImage(imageName, imageUrl);
			this.bonusImageName.push(imageName);
		};
		for (var i = game.params.malus.length - 1; i >= 0; i--) {
			var imageName = "malus"+i;
			var imageUrl = game.params.malus[i];
			game.cameraRender.addImage(imageName, imageUrl);
			this.malusImageName.push(imageName);
		};

		this.countBonus = 0;
		this.countMalus = 0;
	}
	BonusManageur.prototype.create = function(type, x, y, callback){
		var element = {};

		if (type == "bonus"){
			element.image = this.bonusImageName[this.countBonus % this.bonusImageName.length];
			this.countBonus++;
		}
		else{
			element.image = this.malusImageName[this.countMalus % this.malusImageName.length];
			this.countMalus++;
		}

		element.x = x;
		element.y = y;
		element.width = config.bonus.size;
		element.height = config.bonus.size;

		eventBus.emit("bonus create", element, this[callback]);
	}
	// BonusManageur.prototype.createGroup

		/*** 
			Stockage des fonction de callback des bonus
		***/
	BonusManageur.prototype.jump = function(target){
		target.speedY = -35; 
	}
	BonusManageur.prototype.reject = function(target){
		target.speedX = -10;
	}

	return BonusManageur;
});    	