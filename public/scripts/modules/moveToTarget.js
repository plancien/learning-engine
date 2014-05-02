define([
    'event_bus',
    "modules/tools"
], function(eventBus,tools) {
 /*
	This function must be used as a prototype

	Object.moveToObject = moveToTarget;
 */

 	getCanvas = {};
  	eventBus.on('newCanvas', function(canvas) {
        getCanvas = canvas;
    });	
	function moveToTarget (objective,speed,delay) {
		totalOffsetX = getCanvas.canvas.offsetLeft - getCanvas.canvas.scrollLeft;
		totalOffsetY = getCanvas.canvas.offsetTop - getCanvas.canvas.scrollTop;
		distance = tools.vectors.getDistance({x:this.x + totalOffsetX, y : this.y + totalOffsetY},objective)
		if (distance < speed){
			this.x = objective.x - totalOffsetX;
			this.y = objective.y - totalOffsetY;
			return
		}
	 		speed = delay ? tools.vectors.getDistance({x:this.x + totalOffsetX, y : this.y + totalOffsetY},objective) / (delay / 1000) : speed;
			this.x -= Math.cos(tools.vectors.getAngle({x:this.x + totalOffsetX, y : this.y + totalOffsetY},objective))*speed;
			this.y -= Math.sin(tools.vectors.getAngle({x:this.x + totalOffsetX, y : this.y + totalOffsetY},objective))*speed;
	}
	return moveToTarget;

});


