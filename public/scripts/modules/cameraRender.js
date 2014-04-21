define(['event_bus'], function(eventBus) {

	var CameraRender = function(){
	}
	CameraRender.prototype.content = [];
	CameraRender.prototype.x = 0;
	CameraRender.prototype.y = 0
	CameraRender.prototype.init = function(canvas, quad, color){
		this.canvas = canvas;
		this.noColorElement = color || "rgba(255,0,0,1)";
		if (quad){
			this.quadTree = [];
			this.quadTreeWidth = canvas.width/3;
			this.quadTreeHeight = canvas.height/3;
			this.frame = 0;
		}
	}
	CameraRender.prototype.render = function(context){
		if (this.targetFixed){
			this.x = this.targetFixed.x + this.targetFixed.width/2 - this.canvas.width/2;
			this.y = this.targetFixed.y + this.targetFixed.height/2 - this.canvas.height/2;
			this.recalculQuadOf(this.targetFixed);
		}

		if (this.quadTree){
			this.frame++;
			var quadX = (this.x/this.quadTreeWidth)|0;
			var quadY = (this.y/this.quadTreeHeight)|0;

			var endX = ((this.x + this.canvas.width) / this.quadTreeWidth)|0;
			var endY = ((this.y + this.canvas.height) / this.quadTreeHeight)|0;

			for (var i = quadX ; i <= endX ; i++){
				if (!this.quadTree[i])
					continue;
				for (var j = quadY ; j <= endY ; j++){
					if (!this.quadTree[i][j])
						continue;
					for (var k = 0, max = this.quadTree[i][j].length; k < max; k++) {
						var target = this.quadTree[i][j][k];
						if (target.cameraRender.frame != this.frame){
							target.cameraRender.frame = this.frame;
							this.canvas.context.fillStyle = target.color || this.noColorElement;
							this.canvas.context.fillRect(target.x-this.x, target.y-this.y, target.width, target.height);	
						}
					}
				}
			}
		}
		else{
			for (var i = 0, max = this.content.length; i < max; i++) {
				var target = this.content[i];
				this.canvas.context.fillStyle = target.color || this.noColorElement;
				if (this.content[i].radius){
					this.content[key].canvas.context.beginPath();
					this.content[key].canvas.context.arc(target.x+target.radius, target.pos.y+target.radius, target.radius, 0, 2 * Math.PI);
					this.content[key].canvas.context.fill();
				}
				else{
					this.canvas.context.fillRect(target.x-this.x, target.y-this.y, target.width, target.height);	
				}
			};
		}
	}
	CameraRender.prototype.add = function(element, zIndex){
		this.content.push(element);
		if (this.quadTree){
			var quadX = (element.x / this.quadTreeWidth)|0;
			var quadY = (element.y / this.quadTreeHeight)|0;

			var endX = ((element.x + element.width) / this.quadTreeWidth)|0;
			var endY = ((element.y + element.height) / this.quadTreeHeight)|0;

			for (var i = quadX ; i <= endX ; i++){
				if (!this.quadTree[i])
					this.quadTree[i] = [];		
				for (var j = quadY ; j <= endY ; j++){
					if (!this.quadTree[i][j])
						this.quadTree[i][j] = [];	
					this.quadTree[i][j].push(element);
				}
			}
			element.cameraRender = {};
			element.cameraRender.frame = this.frame;
			element.cameraRender.startX = quadX;
			element.cameraRender.endX = endX;
			element.cameraRender.startY = quadY;
			element.cameraRender.endY = endY;

		}
	}
	CameraRender.prototype.fixedCameraOn = function(element){
		this.targetFixed = element;
	}
	CameraRender.prototype.showQuadTree = function(){
		this.canvas.context.lineWidth="2";
		this.canvas.context.strokeStyle="red";
		this.canvas.context.font = "20pt Calibri,Geneva,Arial";

		for (var i = this.quadTree.length - 1; i >= 0; i--) {
			if (!this.quadTree[i])
				continue;
			for (var j = this.quadTree[i].length - 1; j >= 0; j--) {
				var realX = i*this.quadTreeWidth-this.x;
				var realY = j*this.quadTreeHeight-this.y;
				this.canvas.context.beginPath();
				this.canvas.context.rect(realX, realY, this.quadTreeWidth, this.quadTreeHeight)
				this.canvas.context.stroke();
		        this.canvas.context.strokeText(i + " : " + j, realX + 10, realY + 30);
			};
		};
	}
	CameraRender.prototype.recalculQuadOf = function(element){
		this.removeElement(element);
		this.add(element);
	}
	CameraRender.prototype.removeElement = function(element){
		this.content.splice(this.content.indexOf(element), 1);
		if (this.quadTree){
			for (var i = element.cameraRender.startX ; i <= element.cameraRender.endX ; i++){
				for (var j = element.cameraRender.startY ; j <= element.cameraRender.endY ; j++){
					this.quadTree[i][j].splice(this.quadTree[i][j].indexOf(element), 1);
				}
			}
		}
	}
	return new CameraRender();
});