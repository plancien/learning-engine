
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/image_loader',
    'modules/frames',
    'modules/cameraRender',
    'modules/image_loader',
    'modules/simpleElement',
    'game_types/pikaPictures/init',
    'game_types/pikaPictures/level1',
    // 'game_types/pikaPictures/config',
    'game_types/pikaPictures/pikachu'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, frames, Mouse, cameraRender, imageLoader, element, init, level, pikachu) { // init,
    window.cameraRender = cameraRender;
    window.collisionEngine = collisionEngine;
    window.element = element;
    var game = {};
    window.pGame = game;


    collisionEngine.group.pikachu.target.push('wall');

    game.pikachu = pikachu.pikachu;

    init(game);
    level(game);

    cameraRender.fixedCameraOn(game.pikachu);
    cameraRender.putSpriteOn(game.pikachu, "pikachu");
    cameraRender.add(game.pikachu, 11);
    game.pikachu.changeAnimation("idleRight");

    var run = function(game){
        requestAnimationFrame(function(){run(game)});
        game.frame++;
        heroEngine.calcul();
        gravityEngine.calcul();
        collisionEngine.calcul();
        cameraRender.render();
        cameraRender.showQuadTree();
        game.pikachu.run();
    };
    requestAnimationFrame(function(){run(game)});
});
