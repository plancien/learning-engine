
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/canvas',
    'modules/image_loader',
    'modules/frames'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, Canvas, frames, Mouse) {
    var game = {};
    game.frame = 0;
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;
    game.canvas.context.fillStyle = "rgba(30,30,30,0.8)";

    var run = function(game){
        requestAnimationFrame(function(){run(game)});
        game.frame++;
        game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
        // wall.render(game.canvas.context);
    };
    requestAnimationFrame(function(){run(game)});
});
