define(['event_bus'], function(eventBus) {

	function collisionCircles(c1, c2){
		if (c1.x-c1.radius <= c2.x+c2.radius && c1.x -c1.radius>= c2.x-c2.radius
			&& c1.y-c1.radius<= c2.y+c2.radius && c1.y-c1.radius>= c2.y-c2.radius){
			return true;
		else 
			return false;
	}

	function collisionSquares(s1, s2){
		if (s1.x+s1.width >= s2.x && s1.x+s1.width <= s2.x + s2.width
			&& s1.y +s1.length >= s2.y && s1.y+s1.length <= s2.y+s2.width){
			return true;
		else
			return false;
		}
	}

	function collisionCircleAndPoint(point, circle){
		if (point.x <= circle.x+circle.radius && point.x >= circle.x-circle.radius
			&& point.y <= circle.y+circle.radius && point.y >= circle.y-circle.radius){
			return true;
		else 
			return false;
		}

	}

	function collisionSquareAndPoint(point, square){
		if (point.x <= square.x+square.length && point.x >= square.x
			&& point.y <= circle.y+circle.radius && point.y >= square.y){
			return true;
		else 
			return false;
		}
	}

	return {CollisionSquares: collisionSquares, 
			CollisionCircles: collisionCircles,
			CollisionCircleAndPoint:collisioncircleAndPoint,
			CollisionSquareAndPoint: collisionSquareAndPoint}					
});