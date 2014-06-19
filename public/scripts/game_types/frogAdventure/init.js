define(['event_bus',
        'modules/collisionEngine',
        'modules/simpleWall',
        'modules/gravityEngine',
        'modules/cameraRender',
        'modules/canvas',
        'game_types/frogAdventure/loadLevel',
        'game_types/frogAdventure/hero',
        'game_types/frogAdventure/config',
        ],
function(eventBus, collisionEngine, wall, gravityEngine, cameraRender, Canvas, loadLevel, Hero, config){
    var init = function(game){

        game.frame = 0;

        game.gravityEngine = gravityEngine;
        game.gravityEngine.acceleration = 1;
        game.gravityEngine.maxSpeed = 30;

        game.canvas = Canvas.create({"width" : 800, "height" : 600});
        game.canvas.width = 800;
        game.canvas.height = 600;
        game.canvas.context.fillStyle = "rgba(30,30,30,0.8)";

        game.cameraRender = cameraRender;
        game.cameraRender.backgroundParralax("./images/sprites/pikachuParallax.png", 1, 0.5);
        game.cameraRender.init(game.canvas, true);
        game.cameraRender.addSprite("hero", "./images/sprites/green_guy_sprites.png", config.heroSprite);

        game.collisionEngine = collisionEngine;
        game.collisionEngine.addGroup("wall", false, false, false);
        game.collisionEngine.addGroup("bonus", ["hero"], false, false);
        game.collisionEngine.addGroup("hero", ["wall"], false, false);

        loadLevel(game);

        Hero(game);
}

    return init;

});     