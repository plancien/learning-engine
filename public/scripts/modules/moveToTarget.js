define([
    'event_bus',
    "tools"
], function(eventBus,tools) {
 /*
	This function returns an array with the new position of the object sent in the 1rst paramater !IF! it's an object !
	IF  object is set to 0 (@param -object == 0), moveToTarget can be used as a prototype so it can be set by doing Object.moveToTarget = moveToTarget
	else you can use moveToTarget as follows:
	var nextPosition =  moveToTarget(object1,object2,speed,delay);
	object.x = nextPosition[0];
	object.y = nextPosition[1];
 */
	function moveToTarget (object,objective,speed,delay) {
		if (typeof object === "number") {
			target = this;
		}
		else
		{
			target = object;
		}
		if (typeof delay === "undefined") {
			if (typeof target.x === "number" && typeof target.y === "number") {
				if (typeof speed === "number") {
					if (typeof objective === "object") {
						if (typeof objective[0] === "number" && typeof objective[1] === "number") {
							target.x += Math.cos(tools.getAngle(target,{x: objective[0],y: objective[1]}))*speed;
							target.y -= Math.sin(tools.getAngle(target,{x: objective[0],y: objective[1]}))*speed;
							return [target.x,target.y];
						}
						else if (typeof objective.x === "number" && typeof objective.y === "number")
						{
							target.x += Math.cos(tools.getAngle(target,objective))*speed;
							target.y -= Math.sin(tools.getAngle(target,objective))*speed;
							return [target.x,target.y];
						}
						else
						{
							throw new Error("Unexpected values for objective's position in moveToTarget(),\n Expecting else an object with x and y properties or an array with array[0] = x and array[1] = y");
						}
					};	
				}
				else
					throw new Error('Unexpected value of speed set for moveToTarget() => '+speed);
			}
			else
				throw new Error('Unable to find x and y properties of object: wrong value for the 1rst paramater of moveToTarget() => '+object);

		}
		else if (typeof delay === "number") {
			if (typeof target.x === "number" && typeof target.y === "number") {
				if (typeof speed === "number") {
					if (typeof objective === "object") {
						var distance = tools.getDistance(target,{x: objective[0],y: objective[1]}/delay
						if (typeof objective[0] === "number" && typeof objective[1] === "number") {
							target.x += Math.cos(tools.getAngle(target,{x: objective[0],y: objective[1]}))*distance;
							target.y -= Math.sin(tools.getAngle(target,{x: objective[0],y: objective[1]}))*distance;
							return [target.x,target.y];
						}
						else if (typeof objective.x === "number" && typeof objective.y === "number")
						{
							target.x += Math.cos(tools.getAngle(target,objective))*distance;
							target.y -= Math.sin(tools.getAngle(target,objective))*distance;
							return [target.x,target.y];
						}
						else
						{
							throw new Error("Unexpected values for objective's position in moveToTarget(),\n Expecting else an object with x and y properties or an array with array[0] = x and array[1] = y");
						}
					};
				}
				else
					throw new Error('Unexpected value of speed set for moveToTarget() => '+speed);	
			}
			else
				throw new Error('Unable to find x and y properties of object: wrong value for the 1rst paramater of moveToTarget() => '+object);
	
		};

	}
	return moveToTarget;

});


