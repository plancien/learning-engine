define(['event_bus', 'game_types/frogAdventure/config', 'game_types/frogAdventure/soundList'
], 
function(eventBus, config, soundList){

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
	BonusManageur.prototype.createGroup = function(nbBonus, nbMalus, bonusCallback, malusCallback, tabObjectPos, offsetX, offsetY){
		var list = []; //On creer la liste des bonus malus

		for (var i = nbBonus ; i > 0 ; i--){	//On ajoute bonus malus dans le tableau
			list.push("bonus");
		}
		for (var i = nbMalus ; i > 0 ; i--){
			list.push("malus");
		}
		shuffle(list);	//On melange

		for (var i = list.length - 1; i >= 0; i--) {	//On creer un bonus avec la liste melange et les position envoye dans l'ordre
			var callback = (list[i] === "bonus") ? bonusCallback : malusCallback;	//On recupere le callback en fonction de bonus malus
			this.create(list[i], tabObjectPos[i].x + offsetX, tabObjectPos[i].y + offsetY, callback);	//creation
		};
	}

		/*** 
			Stockage des fonction de callback des bonus
		***/
	BonusManageur.prototype.jump = function(target){
		target.speedY = -35; 
		target.y -= 5;
		soundList.bonus.play();
	}
	BonusManageur.prototype.littleJump = function(target){
		target.speedY = -30; 
		target.y -= 5;
		soundList.bonus.play();
	}
	BonusManageur.prototype.reject = function(target){
		target.speedX = -10;
		soundList.malus.play();
	}
	BonusManageur.prototype.strongReject = function(target){
		target.speedX = -30;
		soundList.malus.play();
	}







	function shuffle(array) {
	  var currentIndex = array.length
	    , temporaryValue
	    , randomIndex
	    ;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

	return BonusManageur;
});    	

