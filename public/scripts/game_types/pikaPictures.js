
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/canvas',
    'modules/image_loader',
    'modules/frames',
    'modules/cameraRender'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, Canvas, frames, Mouse, cameraRender) {
    window.cameraRender = cameraRender;
    window.collisionEngine = collisionEngine;
    var game = {};
    window.pGame = game;

    var config = {};
    config.wallColor = "rgba(200,200,200,1)";
    config.backgroundColor = "rgba(30,30,30,1)";

    game.frame = 0;
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;
    game.canvas.context.fillStyle = "rgba(30,30,30,0.8)";

    cameraRender.init(game.canvas, true);
    collisionEngine.addGroup("wall", false, false, false);       

    eventBus.on("wall create", function(target){
        cameraRender.add(target, 10);
        collisionEngine.addElement(target, "wall");     
    });


    wall.create(10, 400, 600, 30, config.wallColor);
    wall.create(60, 200, 300, 30, config.wallColor);

    var inputsPika = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
    var configPika = { "x" : 20, "y" : 100, "maxSpeed" : 30, "acceleration" : 5, "deceleration" : 10, "color" : "rgba(0,200,255,1)", "width" : 56, "height" : 30, "inputs" : inputsPika};
    game.pikachu = heroEngine.create(configPika, game.canvas.context, true);
    collisionEngine.addGroup("pikachu", ["wall"], false, false);
    collisionEngine.addElement(game.pikachu, "pikachu");
    game.pikachu.collisionCallBack = {};
    game.pikachu.collisionCallback["wall"] = function(opponent){
        if (game.pikachu.y > opponent.y)
            game.pikachu.y = opponent.y + opponent.height;
        else
            game.pikachu.y = opponent.y - game.pikachu.height; 
    }
    eventBus.on("key pressed Z", function(){ game.pikachu.speedY = -10 });


    cameraRender.fixedCameraOn(game.pikachu);

    var pikaSpriteConfig = {};
    pikaSpriteConfig.idle = {"width" : 56, "height" : 30, "nbAnim" : 4, "loop" : -1, "fps" : 3, "offsetY" : 0};
    pikaSpriteConfig.run = {"width" : 56, "height" : 30, "nbAnim" : 4, "loop" : -1, "fps" : 30, "offsetY" : 100};

    cameraRender.addSprite("pikachu", "./images/pikachu.png", pikaSpriteConfig);
    cameraRender.putSpriteOn(game.pikachu, "pikachu");
    game.pikachu.changeAnimation("idle");


    cameraRender.add(game.pikachu, 11);


    var run = function(game){
        requestAnimationFrame(function(){run(game)});
        game.frame++;
        heroEngine.render();
        game.canvas.context.fillStyle = config.backgroundColor;
        game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

        gravityEngine.calcul();
        collisionEngine.calcul();
        cameraRender.render();
        cameraRender.showQuadTree();
        // wall.render(game.canvas.context);
    };
    requestAnimationFrame(function(){run(game)});
});
