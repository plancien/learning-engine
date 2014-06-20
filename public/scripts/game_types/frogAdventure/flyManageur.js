define(['modules/cameraRender', 'modules/collisionEngine'], 
function(cameraRender, collisionEngine){

	var FlyManageur = function(){
		this.content = [];
		this.countPickUp = 0;


		this.image = new Image();
		this.image.src = "./images/sprites/fly.png";

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
			console.log("Bonsoir !" + hero);
			element.x = 0;
			element.y = 0;
			that.content.splice(that.content.indexOf(element), 1);
			that.countPickUp++;
		};
		this.content.push(element);
	};
	FlyManageur.prototype.displayHud = function(context){
		context.drawImage(this.image, 0, 0, 40, 40);
		var totalFly = this.content.length + this.countPickUp;
		var text = this.countPickUp + "/" + totalFly;

		context.font = 'italic 30pt Calibri';
		context.fillStyle = "rgba(0,0,0, 0.8)";
		context.fillText(text, 45, 30);
	};

	var flyManageur = new FlyManageur();
	return flyManageur;

});    	