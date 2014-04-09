
define([
    'event_bus',
    'modules/squareHero',
    'modules/canvas',
    'modules/image_loader',
    'modules/frames'
], function(eventBus, hero, Canvas, frames, Mouse) {
    var game = {};
    window.pGame = game;
    window.get = hero;
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;

    game.heroEngine = hero;

    game.heroEngine.create(config, game.canvas.context);

    var inputs = {"left":"Q", "right":"D", "up":"Z", "down":"S"};
    var config = { "x" : 20, "y" : 100, "maxSpeed" : 30, "acceleration" : 1, "deceleration" : 10, "color" : "rgba(0,0,255,0.7)", "width" : 30, "height" : 20, "inputs" : inputs};
    game.heroEngine.create(config, game.canvas.context);
    var run = function(game){
	    requestAnimationFrame(function(){run(game)});
        game.canvas.context.fillStyle = "rgba(220,0,220,0.8";
	    game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.heroEngine.render();
    };
    requestAnimationFrame(function(){run(game)});
});
