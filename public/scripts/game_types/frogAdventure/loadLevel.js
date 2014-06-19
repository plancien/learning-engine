define(['event_bus', 'modules/simpleElement', 'modules/simpleWall', 'game_types/frogAdventure/bonusMalus'
], 
function(eventBus, simpleElement, wall, BonusMalus){
    var loadLevel = function(game){
        var bonusMalus = new BonusMalus(game);

        eventBus.on("wall create", function(wall){
            game.cameraRender.add(wall);
            game.collisionEngine.addElement(wall, "wall");
        });

        eventBus.on("bonus create", function(bonus, collisionCallback){
            bonus.color = "black";
                
            game.cameraRender.add(bonus);
            game.collisionEngine.addElement(bonus, "bonus");
            bonus.collisionCallback.hero = collisionCallback;
        });


        var color = 'black';
        wall.create(1100, 1400, 600, 30, color);
        wall.create(1600, 100, 10000, 701, color);
        wall.create(850, 0, 60, 1600, color);
        wall.create(850, 1600, 20000, 60, color);
        bonusMalus.create("bonus", 1600, 1350, "jump"); //Le dernier argument est le collision callback demande
        bonusMalus.create("malus", 1500, 1350, "reject");


    }


    return loadLevel;
});     