define(['event_bus',
 'game_types/frogAdventure/config',
 'game_types/frogAdventure/soundList',
 'game_types/frogAdventure/shuffle',
 'modules/resize_img',
 'ext_libs/randomColor'
],
function(
 eventBus,
 config,
 soundList,
 shuffle,
 resize_img,
 randomColor){

	var BonusManageur = function(game){
		this.bonusImageName = [];
		this.malusImageName = [];
		var colorOption = {"luminosity" : 100}

		for (var i = game.params.bonus.length - 1; i >= 0; i--) { //On ajoute les images bonus et malus dans le moteur de rendue
			var imageName = "bonus"+i;
			var imageUrl = game.params.bonus[i];

			var image = new Image();
			image.src = game.params.bonus[i];
			(function(){
				var excludeName = imageName;
				image.onload = function(){
					var imageConfigured = resize_img(this, config.bonus.size, config.bonus.size, "fit", false, randomColor(colorOption));
					game.cameraRender.images[excludeName] = imageConfigured;
				}
			})();


			game.cameraRender.images[imageName] = image;
			game.cameraRender.addImage(imageName, imageUrl);
			this.bonusImageName.push(imageName);
		};
		for (var i = game.params.malus.length - 1; i >= 0; i--) {
			var imageName = "malus"+i;
			var imageUrl = game.params.malus[i];

			var image = new Image();
			image.src = game.params.malus[i];
			(function(){
				var excludeName = imageName;
				image.onload = function(){
					var imageConfigured = resize_img(this, config.bonus.size, config.bonus.size, "fit", false, randomColor(colorOption));
					game.cameraRender.images[excludeName] = imageConfigured;
				}
			})();

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
	BonusManageur.prototype.bigJump = function(target){
		target.speedY = -40; 
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
	BonusManageur.prototype.bottomEject = function(target){
		target.speedY += 20;
		soundList.malus.play();
	}
	BonusManageur.prototype.stayOn = function(target){
		target.y = this.super.y - target.height;
		target.canJump = true;
        target.currentJumpFrame = target.nbFrameJump;
        target.speedY = 0;
	}



	return BonusManageur;
});    	

