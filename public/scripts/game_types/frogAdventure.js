define(['event_bus', 'game_types/frogAdventure/init'], 
function(eventBus, init) { 

    return function(params){
        var game = {};
        window.pGame = game;
        game.params = params;
        init(game);

        var run = function(game){
            requestAnimationFrame(function(){run(game)});
            game.frame++;
            game.gravityEngine.calcul();
            game.collisionEngine.calcul();
            game.cameraRender.render();
            // game.cameraRender.showQuadTree();
            eventBus.emit("new frame");     //Permet d'appeler les inputs
            game.hero.run();
        };
        run(game);
    }

});