define(['event_bus', 'game_types/frogAdventure/init', 'game_types/frogAdventure/flyManageur'], 
function(eventBus, init, flyManageur) { 

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
            eventBus.emit("new frame");     //Permet d'appeler les inputs
            game.hero.run();
            flyManageur.displayHud(game.canvas.context);
        };
        run(game);
    }

});