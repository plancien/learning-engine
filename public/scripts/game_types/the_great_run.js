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
    'game_types/theGreatRun/strips'
], function(eventBus, canvasModule, render, imageLoader, frames, keyListner, scoreModule, generateBonuses, generateStrips, Strip) {
   

    var isInside = function inInside (objectB){
        if(this.x < objectB.x){
            if(this.x + this.width/2 > objectB.x - objectB.width/2){
                if(this.y < objectB.y){
                    if(this.y + this.height/2 > objectB.y - objectB.height/2){
                        return true;
                    }
                }else if(this.y - this.width/2 < objectB.y + objectB.width/2){
                    return true;
                }
            }
        }else if(this.x - this.width/2 < objectB.x + objectB.width/2){
            if(this.y < objectB.y){
                if(this.y + this.height/2 > objectB.y - objectB.height/2){
                        return true;
                    }
            }else if(this.y - this.width/2 < objectB.y + objectB.width/2){
                return true;
            }
        }
        return false;
    }

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
                function Player(params) {
                    this.x = params.x;
                    this.y = params.y;
                    this.width = params.width;
                    this.height = this.width;
                    this.speed = 74;
                    this.rotation = 0;
                    this.canMove = true;
                    var movedDistance = 0;
                    var moveDirection = {
                        x: 0,
                        y: 0
                    };

                    eventBus.emit('init render', {
                        object: this,
                        sprite: {
                            x: 0,
                            y: 0,
                            width: 25,
                            height: 25,
                            img: imageLoader("frog.png")
                        },
                        rotating: true
                    });

                    eventBus.emit("add animation", this, {
                        name: "jump",
                        sprites: [{
                            x: 0,
                            y: 0,
                            width: 25,
                            height: 25
                        }, {
                            x: 50,
                            y: 0,
                            width: 25,
                            height: 25
                        }, {
                            x: 25,
                            y: 0,
                            width: 25,
                            height: 25
                        }]
                    });

                    Player.prototype.move = function() {
                        if (Math.abs(movedDistance) >= this.width) {
                            movedDistance = 0;
                            this.canMove = true;
                            moveDirection = {
                                x: 0,
                                y: 0
                            };
                        } else {
                            this.x += moveDirection.x * this.speed;
                            this.y += moveDirection.y * this.speed;
                            movedDistance += moveDirection.x * this.speed + moveDirection.y * this.speed;
                        }
                    };

                    Player.prototype.isInside = isInside;

                    eventBus.on("key pressed", function(keycode) {
                        if (!player.canMove) return;
                        var x = 0;
                        var y = 0;
                        switch (keycode) {
                        case "left":
                            if (player.x - player.width <= 0) {
                                x = 0;
                            } else {
                                x = -1;
                            }
                            player.rotation = Math.PI / 2;
                            break;
                        case "up":
                            if (player.y - player.height <= 0) {
                                y = 0;
                            } else {
                                y = -1;
                            }
                            player.rotation = Math.PI;
                            break;
                        case "right":
                            if (player.x + player.width >= canvas.canvas.width) {
                                x = 0;
                            } else {
                                x = 1;
                            }
                            player.rotation = -Math.PI / 2;
                            break;
                        case "down":
                            if (player.y + player.height >= canvas.canvas.height) {
                                y = 0;
                            } else {
                                y = 1;
                            }
                            player.rotation = 0;
                            break;
                        default:
                            return;
                            break;
                        }
                        canMove = false;
                        moveDirection = {
                            x: x,
                            y: y
                        };
                        eventBus.emit("play animation", player, "jump");
                    });

                    eventBus.on("collision", function(parama, paramb) {
                        console.log(parama, paramb);
                    });
                }

                var strips = [];
                var cars = [];
                var bonuses = [];
                strips.push(new Strip({
                    y: 600 - 37.5,
                    type: "grass"
                }));
                generateStrips(0, strips, cars, bonuses);
                var player = new Player({
                    x: 400,
                    y: 600 - 37.5,
                    width: 60,
                    height: 60
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
