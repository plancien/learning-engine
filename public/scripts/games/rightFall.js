/*

*/


define([
    'event_bus',
    'modules/gauge',
    'modules/canvas',
    'modules/frames',
    'modules/key_listener'
], function(eventBus, Gauge, Canvas, frames, Mouse) {
    var game = {};
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;
    window.pGame= game;
    eventBus.on("key pressed", function(key){
    	console.log(key);
    });

    var run = function(game){
	    requestAnimationFrame(function(){run(game)});
	    game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
    };
    requestAnimationFrame(function(){run(game)});
});
