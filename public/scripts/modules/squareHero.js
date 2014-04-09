/***************************************************************************************************************
*					09/04/14 - V1 - Baptiste
*
* Create a Hero class creating hero. Hero listen standardly arrow key.
* @config => Waiting a object
* @context => Sent the context 
* @Gravity => Comming soon
*
* nota : See game_types/Simba.js 
*
***************************************************************************************************************/


define(['event_bus', 'modules/key_listener'], function(eventBus) {
	var HeroEngine = function(){
		this.content = [];
	}
	HeroEngine.prototype.create = function(config, context, gravity){
		if (!config)
			var config = {};
		var target = {};
		target.x = config.x || 0;
		target.y = config.y || 0;
		target.width = config.width || 50;
		target.height = config.height || 100;
		target.maxSpeed = config.maxSpeed || 20;
		target.acceleration = config.acceleration || 3;
		target.strengthJump = config.strengthJump || 3;
		target.deceleration = config.deceleration || 1.5;
		target.color = config.color || "rgba(0,255,255,1)";
		target.speedX = 0;
		target.speedY = 0;
		target.inputs = {};
		if (!config.inputs)
			config.inputs = {};
		target.inputs.left = config.inputs.left || "left";
		target.inputs.right = config.inputs.right || "right";
		target.inputs.up = config.inputs.up || "up";
		target.inputs.down = config.inputs.down || "down";
		target.haveMoveX = false;
		target.haveMoveY = false;
		if (context)
			target.contextReference = context;
		else
			console.warn("squareHero need a canvas context to run. Please, sent it in second argument");

		target.move = function(x, y){
			if (x != 0){
				target.speedX += (x * target.acceleration);
				if (Math.abs(target.speedX) > target.maxSpeed)
					target.speedX = (target.speedX < 0) ? -target.maxSpeed : target.maxSpeed;
				target.haveMoveX = true;
			}
			else{
				target.speedY += (y * target.acceleration);
				if (Math.abs(target.speedY) > target.maxSpeed)
					target.speedY = (target.speedY < 0) ? -target.maxSpeed : target.maxSpeed;
				target.haveMoveY = true;			
			}
		}
		var that = target;
		eventBus.on("keys still pressed "+target.inputs.left, function(){that.move(-1,0)});
		eventBus.on("keys still pressed "+target.inputs.right, function(){that.move(1,0)});
		eventBus.on("keys still pressed "+target.inputs.up, function(){that.move(0,-1)});
		eventBus.on("keys still pressed "+target.inputs.down, function(){that.move(0,1)});

		eventBus.on("render", function(){that.render()});
		this.content.push(target);
	}
	HeroEngine.prototype.render = function(){
		for (var i = this.content.length - 1; i >= 0; i--) {
			if (!this.content[i].haveMoveX){
				if (Math.abs(this.content[i].speedX) <= this.content[i].deceleration)
					this.content[i].speedX = 0;
				else{
					this.content[i].speedX += (this.content[i].speedX > 0) ? -this.content[i].deceleration: this.content[i].deceleration;
				}
			}
			if (!this.content[i].haveMoveY){
				if (Math.abs(this.content[i].speedY) <= this.content[i].deceleration)
					this.content[i].speedY = 0;
				else{
					this.content[i].speedY += (this.content[i].speedY > 0) ? -this.content[i].deceleration: this.content[i].deceleration;
				}	
			}
			this.content[i].haveMoveX = false;
			this.content[i].haveMoveY = false;
			this.content[i].contextReference.fillStyle = this.content[i].color;
			this.content[i].x += this.content[i].speedX;
			this.content[i].y += this.content[i].speedY;
			if (this.content[i].contextReference)
				this.content[i].contextReference.fillRect(this.content[i].x, this.content[i].y, this.content[i].width, this.content[i].height);
		}
	}

	return new HeroEngine();
});
