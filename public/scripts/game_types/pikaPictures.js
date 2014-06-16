
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/frames',
    'modules/cameraRender',
    'modules/simpleElement',
    'game_types/pikaPictures/init',
    'game_types/pikaPictures/level1',
    'game_types/pikaPictures/pikachu'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, frames, cameraRender, element, init, level, pikachu) { // init,
    return function (params){
        window.cameraRender = cameraRender;
        window.collisionEngine = collisionEngine;
        window.element = element;
        var game = {};
        game.params = params;
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
    }
});
