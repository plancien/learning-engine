define([ 'event_bus',
         'modules/simpleElement',
         'modules/simpleWall',
         'modules/httpGet',
         'game_types/frogAdventure/bonusMalus',
         'game_types/frogAdventure/gradientList',
         'game_types/frogAdventure/config',
         'game_types/frogAdventure/createWallBox'
], 
function(eventBus, simpleElement, wall, httpGet, BonusMalus, getGradientList, config, createWallBox){
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


        var gradient = getGradientList(game.canvas.context);
        var box = config.level;

        for (var i = 1; i <= load.nbLevel; i++) {
            var randomLevel = (Math.random() * 4)|0 + 1;
            var level = httpGet.json("scripts/game_types/frogAdventure/level/level"+randomLevel+".json");

            if (i === 1){
                game.hero.x = box.startX - game.hero.width;
                game.hero.y = box.startY + level.startY - (box.doorHeight/2);
            }
            else{
                box.startY -= level.startY - memoryEndY;
            }

       
            createWallBox(box, level, wall);



            for (var j = level.wall.length - 1; j >= 0; j--) {
                var currentWall = level.wall[j];
                wall.create(currentWall.x + box.startX, 
                            currentWall.y + box.startY, 
                            currentWall.width, 
                            currentWall.height, 
                            gradient[currentWall.color]);
            };
            for (var j = level.bonusGroup.length - 1; j >= 0; j--) {
                var currentGroup = level.bonusGroup[j];
                bonusMalus.createGroup(  currentGroup.bonus,
                                         currentGroup.malus,
                                         currentGroup.bonusCallback,
                                         currentGroup.malusCallback,
                                         currentGroup.position,
                                         box.startX,
                                         box.startY)
            };

            box.startX += level.width + box.containerWallSize*2;
            var memoryEndY = level.endY;
        };
    }


    return loadLevel;
});     