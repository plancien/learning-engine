

define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/canvas',
    'modules/image_loader',
    'modules/frames',
    'modules/cameraRender',
    'modules/image_loader',
    'modules/simpleElement',
    'game_types/pikaPictures/init',
    'game_types/pikaPictures/level1',
    'game_types/pikaPictures/config',
    'game_types/pikaPictures/pikachu'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, Canvas, frames, Mouse, cameraRender, imageLoader, element, init, level, config, pikachu) { // init,
    var initialisationConfigurationPikachu = function(){
    var inputsPika = {"left":"Q", "right":"D", "up":"Z", "down":"S"};   //On applique des inputs pour ce hero
    var configPika = { "x" : 1200, "y" : 1100, "maxSpeed" : 30, "acceleration" : 4, "deceleration" : 2, "color" : "rgba(0,200,255,1)", "width" : 39, "height" : 41, "inputs" : inputsPika};
    game.pikachu = heroEngine.create(configPika, game.canvas.context, true);
    collisionEngine.addElement(game.pikachu, "pikachu");
    game.pikachu.collisionCallBack = {};
    game.pikachu.collisionCallback["wall"] = function(opponent){
        if (game.pikachu.x + game.pikachu.width > opponent.x && game.pikachu.x < opponent.x)
            game.pikachu.x = opponent.x - game.pikachu.width;
        else if (game.pikachu.x < opponent.x + opponent.width && game.pikachu.x + game.pikachu.width > opponent.x + opponent.width)
            game.pikachu.x = opponent.x + opponent.width;
        else if (game.pikachu.y > opponent.y){
            game.pikachu.y = opponent.y + opponent.height;
                if(!game.pikachu.desaccrochage){
                    game.pikachu.accrochage= true;
                }
             if(game.pikachu.currentAnim=="runLeft"){
                game.pikachu.speedY=-5;
                game.pikachu.changeAnimation("runLeftReverse");
                
             }
             else if(game.pikachu.currentAnim=="runRight"){
                game.pikachu.speedY=-5;
                game.pikachu.changeAnimation("runRightReverse");
                
             }
        }
        else{
             game.pikachu.desaccrochage=false;
             game.pikachu.accrochage= false;
             game.pikachu.y = opponent.y - game.pikachu.height; 
            
        }
    }
}();