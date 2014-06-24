define(['modules/cameraRender',
		 'modules/collisionEngine',
		 'game_types/frogAdventure/config',
		 'game_types/frogAdventure/soundList'], 
function(cameraRender, collisionEngine, config, soundList){
	var hudConfig = config.hud;

	var FlyManageur = function(){
		this.content = [];
		this.countPickUp = 0;
		this.animateFly = false;

		this.image = new Image();
		this.image.src = "./images/frogAdventure/fly.png";

		window.content = this.content;
	}

	FlyManageur.prototype.create = function(x, y){
		var element = {
				"x" : x,
				"y" : y,
				"width" : 50,
				"height" : 50,
				"image" : "fly"
		};

		cameraRender.add(element);
		collisionEngine.addElement(element, "fly");

		var that = this;
		element.collisionCallback.hero = function(hero){
			var angle = Math.atan2(-element.y, -element.x);

			that.animateFly = {};
			that.animateFly.vecX = Math.cos(angle) * hudConfig.animateFlySpeed;
			that.animateFly.vecY = Math.sin(angle) * hudConfig.animateFlySpeed;
			that.animateFly.x = element.x - cameraRender.x;
			that.animateFly.y = element.y - cameraRender.y; 

			element.x = 0;
			element.y = 0;
			that.content.splice(that.content.indexOf(element), 1);
			that.countPickUp++;

			soundList.pickupFly.play();
		};
		this.content.push(element);
	};
	FlyManageur.prototype.displayHud = function(context){
		context.drawImage(this.image, 0, 0, hudConfig.imageSize, hudConfig.imageSize);
		var totalFly = this.content.length + this.countPickUp;
		var text = this.countPickUp + "/" + totalFly;

		context.font = 'italic 30pt Calibri';
		context.fillStyle = "rgba(0,0,0, 0.8)";
		context.fillText(text, 45, 30);

		if (this.animateFly){
			this.animateFly.x += this.animateFly.vecX;
			this.animateFly.y += this.animateFly.vecY;
			if (this.animateFly.x > 0 || this.animateFly.y > 0)
				context.drawImage(this.image, this.animateFly.x, this.animateFly.y, hudConfig.imageSize, hudConfig.imageSize);
			else
				this.animateFly = false;
		}
	};

	var flyManageur = new FlyManageur();
	return flyManageur;

});    	