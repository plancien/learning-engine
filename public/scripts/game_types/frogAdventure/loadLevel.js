define([ 'event_bus',
         'modules/simpleElement',
         'modules/simpleWall',
         'game_types/frogAdventure/bonusMalus',
         'game_types/frogAdventure/gradientList',
         'game_types/frogAdventure/config'
], 
function(eventBus, simpleElement, wall, BonusMalus, getGradientList, config){

    // utility function for loading assets from server
    function httpGet(theUrl) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    // utility function for loading json data from server
    function httpGetData(theUrl) {
        var responseText = httpGet(theUrl);
        return JSON.parse(responseText);
    }


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

        var box = config.level;
        for (var i = 1; i <= 3; i++) {
            var level = httpGetData("scripts/game_types/frogAdventure/level/level"+i+".json");

            console.log(box.startX);
                

            if (i === 1){
                game.hero.x = box.startX - game.hero.width;
                game.hero.y = box.startY + level.startY - (box.doorHeight/2);
            }
            else{
                box.startY -= level.startY - memoryEndY;
            }

            //Creer le mur du bas
            wall.create(box.startX,
                        box.startY + level.height,
                        level.width,
                        box.containerWallSize, 
                        "black");

            //Creer le mur de gauche haut
            wall.create(box.startX - box.containerWallSize,
                        box.startY - box.containerWallSize,
                        box.containerWallSize, 
                        level.startY - (box.doorHeight/2) + box.containerWallSize,
                        "black");

            //Cree le mur de gauche bas
            wall.create(box.startX - box.containerWallSize,
                        box.startY + (box.doorHeight/2) + level.startY,
                        box.containerWallSize, 
                        level.height - (level.startY + (box.doorHeight/2)) + box.containerWallSize,
                        "black");

            //Creer le mur de gauche haut
            wall.create(box.startX + level.width,
                        box.startY - box.containerWallSize,
                        box.containerWallSize, 
                        level.endY - (box.doorHeight/2) + box.containerWallSize,
                        "black");

            //Cree le mur de droite bas
            wall.create(box.startX + level.width,
                        box.startY + (box.doorHeight/2) + level.endY,
                        box.containerWallSize, 
                        level.height - (level.endY + (box.doorHeight/2)) + box.containerWallSize,
                        "black");

            //Cree le mur du haut
            wall.create(box.startX,
                        box.startY - box.containerWallSize,
                        level.width, 
                        box.containerWallSize,
                        "black");

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