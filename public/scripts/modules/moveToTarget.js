define([
    'event_bus',
    "modules/tools"
], function(eventBus,tools) {
 /*
	This function must be used as a prototype

	Object.moveToObject = moveToTarget.moveTo;
 */
	function moveTo (objective,speed,delay) {
		if (typeof delay === "undefined") {
				if (typeof speed === "number") {
					if (typeof objective === "object") {
						if (typeof objective[0] === "number" && typeof objective[1] === "number") {
							this.x += Math.cos(tools.getAngle(this,{x: objective[0],y: objective[1]}))*speed;
							this.y -= Math.sin(tools.getAngle(this,{x: objective[0],y: objective[1]}))*speed;
							return [this.x,this.y];
						}
						else if (typeof objective.x === "number" && typeof objective.y === "number")
						{
							this.x += Math.cos(tools.getAngle(this,objective))*speed;
							this.y -= Math.sin(tools.getAngle(this,objective))*speed;
							return [this.x,this.y];
						}
						else
							throw new Error("Unexpected values for objective's position in moveToTarget(),\n Expecting else an object with x and y properties or an array with array[0] = x and array[1] = y");
					};	
				}
				else
					throw new Error('Unexpected value of speed set for moveToTarget() => '+speed);
		}
		else if (typeof delay === "number") {
			delay = delay || 1;
				if (typeof speed === "number") {
					if (typeof objective === "object") {
						var speed = tools.getDistance(this,{x: objective[0],y: objective[1]}/delay})
						if (typeof objective[0] === "number" && typeof objective[1] === "number") {
							this.x += Math.cos(tools.getAngle(this,{x: objective[0],y: objective[1]}))*speed;
							this.y -= Math.sin(tools.getAngle(this,{x: objective[0],y: objective[1]}))*speed;
							return [this.x,this.y];
						}
						else if (typeof objective.x === "number" && typeof objective.y === "number")
						{
							this.x += Math.cos(tools.getAngle(this,objective))*speed;
							this.y -= Math.sin(tools.getAngle(this,objective))*speed;
							return [this.x,this.y];
						}
						else
							throw new Error("Unexpected values for objective's position in moveToTarget(),\n Expecting else an object with x and y properties or an array with array[0] = x and array[1] = y");
					};
				}
				else
					throw new Error('Unexpected value of speed set for moveToTarget() => '+speed);	
		};

	}
	return moveToTarget;

});


