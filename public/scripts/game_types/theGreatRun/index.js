/*

@name 
    The great
@endName

@description
    
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
    'modules/resize_img',

    'game_types/theGreatRun/bonusManageur',
    'game_types/theGreatRun/generateStrips',
    'game_types/theGreatRun/strips',
    'game_types/theGreatRun/config',
    'game_types/theGreatRun/player',

    'ext_libs/randomColor',

    'modules/muteHowler'
], function(eventBus,
    canvasModule,
    render,
    imageLoader,
    frames,
    keyListner,
    scoreModule,
    resize_image,
    bonusManageur,
    generateStrips,
    Strip,
    config,
    Player,
    randomColor) {
    return function(globalParams) {
        var die = new Howl({
            urls: ['sounds/effects/crash_explode/TGR_die.wav']
        });

        var music = new Howl({
            urls: ['sounds/musics/TGR_notFree_POL-snowy-hill-short.wav'],
            loop: true
        });

        var paramsCanvas = {
            id: "frogger",
            width: 800,
            height: 600
        };
        eventBus.on('init', function() {
            window.canvas = canvasModule.create(paramsCanvas);
            window.ctx = canvas.context;

            var bonusToLoad = globalParams.bonus.length + globalParams.malus.length;
            var bonusLoaded = 0;

            window.bonusImage = [];
            window.malusImage = [];
            for (var i = 0; i < globalParams.bonus.length; i++) {
                bonusImage.push(new Image());
                bonusImage[i].src = globalParams.bonus[i];
                (function(){
                    var privateI = i;
                    bonusImage[i].onload = function(){
                        bonusImage[privateI] = resize_image(this, config.bonus.size, config.bonus.size, "crop", false, randomColor());
                        thenBonusLoaded();
                    }
                })();
            };

            for (var i = 0; i < globalParams.malus.length; i++) {
                malusImage.push(new Image());
                malusImage[i].src = globalParams.malus[i];
                (function(){
                    var privateI = i;
                    malusImage[i].onload = function(){
                        malusImage[privateI] = resize_image(this, config.bonus.size, config.bonus.size, "crop", false, randomColor());
                        thenBonusLoaded();
                    }
                })();
            };

            function thenBonusLoaded(){
                bonusLoaded++;
                if (bonusToLoad == bonusLoaded)
                    bonusLoad();
            }

            function bonusLoad(){
                music.play();
                window.player = new Player();
                eventBus.on("key pressed", function(keycode) {
                    if (player.dead && keycode === 'enter'){
                        player = new Player();
                        cars = [];
                        bonusManageur.restart(); 
                        generateStrips(0, strips, cars);
                    }
                });

                var strips = [];
                var cars = [];
                strips.push(new Strip({
                    y: 600 - 37.5,
                    type: "grass"
                }));
                generateStrips(0, strips, cars);

                eventBus.on("new frame", function() {
                    ctx.fillStyle = "rgb(0,0,0)";
                    ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

                    if (player.dead) {
                        ctx.fillStyle = "rgb(255,255,255)";
                        ctx.font = "20px Verdana";
                        ctx.fillText("Vous avez obtenu " + player.score + " points", 200, 300);
                        ctx.fillText("Pressez 'Entrée' pour rejouer", 200, 340);
                        return;
                    }

                    var i;
                    for (i = 0; i < strips.length; i++) {
                        eventBus.emit("render object", strips[i], ctx);
                    }
                    bonusManageur.loop(player);
                    for (i = 0; i < cars.length; i++) {
                        cars[i].move();
                        eventBus.emit("render object", cars[i], ctx);
                        if (player.isInside(cars[i])) {
                            player.canMove = "false";
                            player.dead = true;
                            die.play();
                        }
                    }

                    eventBus.emit("animate object", player);
                    eventBus.emit("render object", player, ctx);
                    player.move();
                    eventBus.emit("updates particles");
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
