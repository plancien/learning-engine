define([
    'event_bus',
    'modules/canvas',
], function(eventBus, Canvas) {
	var game = {};
	game.canvas = Canvas.create({"width" : 800, "height" : 600});
	console.log(game.canvas.width)
	game.canvas.context.fillStyle = "rgb(0,0,0)";
	game.canvas.context.fillRect(0,0, 800, 600); 
	alert("hello world");
});