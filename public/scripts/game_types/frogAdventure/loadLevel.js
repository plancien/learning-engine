define(['event_bus', 'modules/simpleElement', 'modules/simpleWall', 'game_types/frogAdventure/bonusMalus', 'game_types/frogAdventure/gradientList'
], 
function(eventBus, simpleElement, wall, BonusMalus, getGradientList){
    var loadLevel = function(game){

        window.wall = wall;

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

        var gradient = getGradientList(game.canvas.context);

        var color = 'black';
        wall.create(1100, 1400, 600, 30, gradient.firstBase);
        wall.create(1500, 100, 10000, 701, "blue");
        wall.create(1700,  851,  50,  550, gradient.arcEnCiel);
        wall.create(850, 0, 60, 1600, "red");
        wall.create(850, 1600, 20000, 60, "black");
        // bonusMalus.create("bonus", 1600, 1350, "jump"); //Le dernier argument est le collision callback demande
        // bonusMalus.create("malus", 1500, 1350, "reject");
        bonusMalus.createGroup(1, 1, "jump", "reject",  [ {"x" : 1600, "y" : 1350}, {"x" : 1500, "y" : 1350} ]);


    }


    return loadLevel;
});     