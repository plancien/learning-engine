define(['event_bus'], function(eventBus) {

	var CollisionEngine = function(){
	}
	CollisionEngine.prototype.group = {};
	CollisionEngine.prototype.box = {};
	CollisionEngine.prototype.addGroup = function(name, target, betweenThem, box){
		if (!this.group[name]){
			this.group[name] = {};
			this.group[name].content = [];
			this.group[name].target = target || "all";
			this.group[name].inBox = box || [];
			this.group[name].betweenThem = betweenThem || false;
		}
	}
	CollisionEngine.prototype.addElement = function(target, name, callback){
		if (!this.group[name])
			this.addGroup(name);

		if (!target.collisionCallback)
			target.collisionCallback = {};
		target.collisionCallback.general = (callback) ? callback : function(){};

		this.group[name].content.push(target);	 
	}
	CollisionEngine.prototype.addHitbox = function(target, shape, offsetX, offsetY, width, height){
		if (!target.hitbox)
			target.hitbox = [];

		var hitbox = {};
		hitbox.shape = shape;
		hitbox.offsetX = offsetX || 0;
		hitbox.offsetY = offsetY || 0;
		if (shape == "circle")
			hitbox.radius = width;
		else{
			hitbox.width = width || target.width || 0;
			hitbox.height = height || target.height || 0;
		}
		target.hitbox.push(hitbox);
	}
	CollisionEngine.prototype.addBox = function(name, target){
		if (!this.box[name]){
			this.box[name] = {};
			this.box[name].x = target.x || 0;
			this.box[name].y = target.y || 0;
			this.box[name].width = target.width;
			this.box[name].height = target.height;	
			this.box[name].name = name;
		}
	}
	CollisionEngine.prototype.calcul = function(context){
		for (var name in this.group){											//Pour tous les groupes
			for (var i = this.group[name].content.length - 1; i >= 0; i--) {	//Pour tous les elements du groupe
				var target = this.group[name].content[i];
				for (var j = target.hitbox.length -1 ; j >= 0 ; j--){			//Pour toutes les hitboxs de cet element
					targetHitbox = target.hitbox[j];
					for (var k = this.group[name].inBox.length - 1 ; k >= 0 ; k--){	//Pour tout les inBox de ce groupe 
						if (target.collisionCallback[this.group[name].inBox[k]])
							target.collisionCallback[this.group[name].inBox[k]](this.isInBox(target.x, target.y, target.hitbox[j], this.group[name].inBox[k]), this.box[this.group[name].inBox[k]]);
						else
							target.collisionCallback.general(this.group[name].inBox[k], this.isInBox(target.x, target.y, target.hitbox[j], this.group[name].inBox[k]), this.box[this.group[name].inBox[k]]);
					}
					if (this.group[name].betweenThem){							//Si ils doivent collisioner entre eux
						for (var k = i-1; k >= 0; k--) {
							var opponent = this.group[name].content[k];
							for(var l = opponent.hitbox.length -1 ; l >= 0 ; l-- ){
								var opponentHitbox = opponent.hitbox[l];
								if (this.rectCollision(target, targetHitbox, opponent, opponentHitbox)){
									target.collisionCallback[name](opponent);
									opponent.collisionCallback[name](opponent);
								}
							}
						};
					}
				}
			}
		}
	}
	CollisionEngine.prototype.render = function(context){
		context.fillStyle = "rgba(255,0,0,0.5";
		for (var name in this.group){
			for (var i = this.group[name].content.length - 1; i >= 0; i--) {
				var target = this.group[name].content[i];
				for (var j = target.hitbox.length -1 ; j >= 0 ; j--){
					var targetHitbox = target.hitbox[j];
					if (target.shape == "circle"){

					}
					else{
						context.fillRect(target.x + targetHitbox.offsetX, target.y + targetHitbox.offsetY, targetHitbox.width, targetHitbox.height);
					}
				}
			};
		}
	}
	CollisionEngine.prototype.isInBox = function(x, y, target, box){
		var box = this.box[box];
		var realX = x + target.offsetX;
		var realY = y + target.offsetY; 
		if ( realX < box.x)
			return "left";
		if ((realX + target.width) > (box.x + box.width))
			return "right";
		if (realY < box.y)
			return "up";
		if ((realY + target.height > box.y + box.height))
			return "down"
		
		return "in";
	}
	CollisionEngine.prototype.rectCollision = function(a, aHitbox, b, bHitbox){
		var aRealX = a.x + aHitbox.offsetX;
		var aRealY = a.y + aHitbox.offsetY;
		var bRealX = b.x + bHitbox.offsetX;
		var bRealY = b.y + bHitbox.offsetY;
		if ( aRealX + aHitbox.width > bRealX &&
			aRealX < bRealX + bHitbox.width &&
			aRealY + aHitbox.height > bRealY &&
			aRealY < bRealY + bHitbox.height)
			return true
	}
	return new CollisionEngine();
});