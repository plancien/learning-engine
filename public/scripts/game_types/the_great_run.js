/*

@name 
    The great
@endName

@description
    move with arrows, collect as many bonuses as possible, avoid maluses and go as far as you can
@endDescription

*/

define([
    'event_bus',
    'modules/canvas',
    'modules/render',
    'modules/imageLoader',
    'modules/frames',
    'modules/key_listener',
    'modules/score',

    'game_types/theGreatRun/generateBonuses',
    'game_types/theGreatRun/generateStrips',
    'game_types/theGreatRun/strips',
    'game_types/theGreatRun/player'
], function(eventBus, canvasModule, render, imageLoader, frames, keyListner, scoreModule, generateBonuses, generateStrips, Strip, Player) {

    return function(globalParams) {

        var paramsCanvas = {
            id: "frogger",
            width: 800,
            height: 600
        };
        var score = 0;

        eventBus.on('init', function() {
            window.canvas = canvasModule.create(paramsCanvas);
            var ctx = canvas.context;

            var bonusToLoad = 2;
            var bonusLoaded = 0;

            window.bonusImage = new Image();
            bonusImage.src = globalParams.bonusUrl;
            bonusImage.onload = thenBonusLoaded;

            window.malusImage = new Image();
            malusImage.src = globalParams.malusUrl;
            malusImage.onload = thenBonusLoaded;

            function thenBonusLoaded(){
                bonusLoaded++;
                if (bonusToLoad == bonusLoaded)
                    bonusLoad();
            }

            function bonusLoad(){
                var strips = [];
                var cars = [];
                var bonuses = [];
                strips.push(new Strip({
                    y: 600 - 37.5,
                    type: "grass"
                }));
                generateStrips(0, strips, cars, bonuses);

                var playerHitbox = {"width" : 40, "height" : 40, "offsetX" : 10, "offsetY" : 10};
                var player = new Player({
                    x: 400,
                    y: 600 - 37.5,
                    width: 60,
                    height: 60,
                    hitbox: playerHitbox
                });

                eventBus.on("new frame", function() {
                    ctx.fillStyle = "rgb(0,0,0)";
                    ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

                    if (player.dead) {
                        ctx.fillStyle = "rgb(255,255,255)";
                        ctx.font = "20px Verdana";
                        ctx.fillText("Vous avez obtenu " + score + " points", 200, 300);
                        return;
                    }

                    var i;
                    for (i = 0; i < strips.length; i++) {
                        eventBus.emit("render object", strips[i], ctx);
                                        }
                    for (i = 0; i < bonuses.length; i++) {
                        eventBus.emit("render object", bonuses[i], ctx);
                        if (player.isInside(bonuses[i])) {
                            eventBus.emit("add points", bonuses[i].points);
                            score += bonuses[i].points;
                            bonuses.splice(i, 1);
                            i--;
                        }
                    }

                    for (i = 0; i < cars.length; i++) {
                        cars[i].move();
                        eventBus.emit("render object", cars[i], ctx);
                        if (player.isInside(cars[i])) {
                            player.canMove = "false";
                            player.dead = true;
                        }
                    }

                    eventBus.emit("animate object", player);
                    eventBus.emit("render object", player, ctx);
                    player.move();
                    if (player.y <= 75 / 2) {
                        strips = [];
                        bonuses = [];
                        cars = [];
                        strips.push(new Strip({
                            y: 600 - 37.5 - 600,
                            type: "grass"
                        }));
                        generateStrips(-600, strips, cars, bonuses);
                        var j;
                        for (j = 0; j < strips.length; j++) {
                            strips[i].y += 600;
                        }
                        for (j = 0; j < bonuses.length; j++) {
                            bonuses[j].y += 600;
                        }
                        for (j = 0; j < cars.length; j++) {
                            cars[j].y += 600;
                        }
                        player.y = 600 - 37.5;
                    }
                });
            }
        });
    };
});

var patterns = {
    "1": [
        [100],
        [20],
        [250],
        [700],
        [600]
    ],
    "2": [
        [100, 250],
        [0, 400],
        [150, 450],
        [200, 500],
        [0, 500]
    ],
    "3": [
        [0, 300, 700],
        [0, 500, 600],
        [200, 500, 700],
        [100, 250, 600]
    ],
    "4": [
        [0, 300, 700, 500],
        [0, 500, 600, 700],
        [200, 500, 700, 0],
        [100, 250, 600, 750]
    ]
};
