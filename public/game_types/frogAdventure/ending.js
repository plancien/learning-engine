define(['event_bus', 'modules/cameraRender', 'modules/collisionEngine', 'game_types/frogAdventure/config', 'game_types/frogAdventure/flyManageur'], 
function(eventBus, cameraRender, collisionEngine, config, flyManageur){

	var Ending = function(){
		this.globalAlpha = 0;
		this.incrementGlobalAlpha = 0.02;
	};
	Ending.prototype.init = function(x, y){
		for (var i = 1; i >= 0; i--) {
			var ending = {
			"x" : x,
			"y" : y + 5 +(config.level.doorHeight/2 * i),
			"width" : config.level.doorHeight,
			"height" : config.level.doorHeight/2 - 10
			};
			ending.x -= ending.width;
			ending.image = "ending"+i;


			cameraRender.add(ending, 30);
			collisionEngine.addElement(ending, "ending");
			ending.collisionCallback.hero = function(){
				eventBus.emit("ending");
			};
		};
	};
	Ending.prototype.loop = function(context){
		this.globalAlpha += this.incrementGlobalAlpha;
		if (this.globalAlpha > 0.7)
			this.globalAlpha = 0.7;

		var totalFly = flyManageur.content.length + flyManageur.countPickUp;
		var score = flyManageur.countPickUp + "/" + totalFly;

		var text = "Félicitation";
		var text2 = "votre score : " + score;

		context.globalAlpha = this.globalAlpha || 0.5;
		context.fillStyle = "black";
		context.fillRect(0, 0, 1280, 720);

		var x = 400 - context.measureText(text).width/2;
		var x2 = 400 - context.measureText(text2).width/2;

		context.font = 'italic 60pt Calibri';
		context.fillStyle = "white";
		context.fillText(text, x, 250);
		context.fillText(text2, x2, 350);

		context.globalAlpha = 1;
	}

	var ending = new Ending;
	return ending;

});    	