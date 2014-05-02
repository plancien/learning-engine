
define([
    'event_bus',
    'modules/simpleWall',
    'modules/simpleElement'
], function(eventBus, wall, element) { // init,
//Initialisation des elements du jeu
	var init = function(){
		var color = 'black';
	    wall.create(1100, 1400, 600, 30, color);
	    wall.create(1600, 100, 10000, 701, color);
	    wall.create(850, 0, 60, 1600, color);
	    wall.create(850, 1600, 20000, 60, color);
	    element.create(1600, 1350, 50, 50, "bonus");
	}
	return init;
});