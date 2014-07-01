define([ 'event_bus',
         'modules/simpleElement',
         'modules/simpleWall',
         'modules/httpGet',
         'game_types/frogAdventure/bonusMalus',
         'game_types/frogAdventure/gradientList',
         'game_types/frogAdventure/config',
         'game_types/frogAdventure/createWallBox',
         'game_types/frogAdventure/flyManageur',
         'game_types/frogAdventure/ending',
          'game_types/frogAdventure/shuffle'
], 
function(eventBus, simpleElement, wall, httpGet, BonusMalus, getGradientList, config, createWallBox, flyManageur, ending, shuffle){
    var loadLevel = function(game){

        var wallList = [];
        var gradient = getGradientList(game.canvas.context, function(name, pattern){    //Quand le pattern de fond a finis d'etre charge, on l'applique au mur
            gradient[name] = pattern;
            if (name == "wallPattern"){
                for (var i = wallList.length - 1; i >= 0; i--) {
                    wallList[i].color = pattern;
                };
            }
            else if (name == "topWall"){
                for (var i = wallList.length - 1; i >= 0; i--) {
                    var topPattern = {
                        "width" : wallList[i].width,
                        "height" : 5,
                        "x" : wallList[i].x,
                        "y" : wallList[i].y - 5,
                        "color" : pattern
                    };
                    game.cameraRender.add(topPattern, 10);
                };
            }
            else if (name == "botWall"){
                for (var i = wallList.length - 1; i >= 0; i--) {
                    var botPattern = {
                        "width" : wallList[i].width,
                        "height" : 5,
                        "x" : wallList[i].x,
                        "y" : wallList[i].y + wallList[i].height,
                        "color" : pattern
                    };
                    game.cameraRender.add(botPattern, 10);
                };
            }
        });
        game.cameraRender.backgroundColor = gradient.backgroundGradient;

        var bonusMalus = new BonusMalus(game);
        var box = config.level;

        eventBus.on("wall create", function(wall){
            wall.color = gradient.wallPattern; 
            game.cameraRender.add(wall, 11);
            game.collisionEngine.addElement(wall, "wall");
            wallList.push(wall);
        });

        eventBus.on("bonus create", function(bonus, collisionCallback){
            bonus.color = "black";
                
            game.cameraRender.add(bonus);
            game.collisionEngine.addElement(bonus, "bonus");
            bonus.collisionCallback.super = bonus;
            bonus.collisionCallback.hero = collisionCallback;
        });


        var randomLevel = [];
        for (var i = 1; i <= load.nbLevel; i++) {
            randomLevel.push(i);
        };
        shuffle(randomLevel);
            
        for (var i = 0; i < load.nbLevel; i++) {
            var level = httpGet.json("game_types/frogAdventure/level/level"+randomLevel[i]+".json");
            // var level = httpGet.json("scripts/game_types/frogAdventure/level/level"+4+".json");


            if (i === 0){
                game.hero.x = box.startX - box.containerWallSize + box.containerWallSize/4;
                game.hero.y = box.startY + level.startY - (box.doorHeight/2);
                createWallBox.init(box, level, wall);
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
                            currentWall.color);
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

            flyManageur.create(level.fly.x + box.startX, level.fly.y + box.startY);

            box.startX += level.width + (box.containerWallSize)*2 -1; //Le -1 permet d'assurer graphiquement la jointure
            var memoryEndY = level.endY;
        };

        ending.init(box.startX - box.containerWallSize, (box.startY + level.endY) - box.doorHeight/2);
    }


    return loadLevel;
});     