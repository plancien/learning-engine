
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
    'modules/simpleElement'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, Canvas, frames, Mouse, cameraRender, imageLoader, element) {
    window.cameraRender = cameraRender;
    window.collisionEngine = collisionEngine;
    window.element = element;
    window.pGame = game;

    var game = {};
    game.frame = 0;
    game.canvas = Canvas.create({"width" : 800, "height" : 600});
    game.canvas.width = 800;
    game.canvas.height = 600;
    game.canvas.context.fillStyle = "rgba(30,30,30,0.8)";


    var config = {};
    var pikaSpriteConfig = {};

    var animationDePikachu = function(){
        pikaSpriteConfig.idle = {"width" : 36, "height" :38, "nbAnim" : 1, "loop" : -1, "fps" : 3, "offsetY" : 64};
        pikaSpriteConfig.idle2 = {"width" : 36, "height" :38, "nbAnim" : 1, "loop" : -1, "fps" : 3, "offsetY" : 320};
        pikaSpriteConfig.runLeft = {"width" : 56, "height" : 30, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 32};
        pikaSpriteConfig.runRight = {"width" : 56, "height" : 28, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 0};
        pikaSpriteConfig.runLeftReverse = {"width" : 55, "height" : 34, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 255};
        pikaSpriteConfig.runRightReverse = {"width" : 55, "height" : 34, "nbAnim" : 4, "loop" : -1, "fps" : 5, "offsetY" : 289};
        pikaSpriteConfig.idleLeftReverse={"width" : 46, "height" : 40, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 359};
        pikaSpriteConfig.idleRightReverse={"width" : 46, "height" : 40, "nbAnim" : 1, "loop" : -1, "fps" : 5, "offsetY" : 401};
    }();


    var init = function(){
        cameraRender.init(game.canvas, true);
        /***** Son *****/
            game.sounds={
                jump : document.createElement('audio'),
            }
            game.sounds.jump.setAttribute('src', "./sounds/jump.ogg");
            game.sounds.jump.setAttribute('preload','true');

        /***** Configuration d'element generaux *****/
            config.wallColor = "rgba(20,20,20,1)";
            config.backgroundColor = "rgba(30,30,30,1)";

        /***** Initialisation des groupes de collision *****/
            collisionEngine.addGroup("wall", false, false, false);       
            collisionEngine.addGroup("bonus", ["pikachu"], false, false);
            collisionEngine.addGroup("pikachu", ["wall"], false, false);

        /***** Gestion des murs *****/
            eventBus.on("wall create", function(target){
                cameraRender.add(target, 10);
                collisionEngine.addElement(target, "wall");     
            });

        /***** Gestion des bonus *****/
            eventBus.on("bonus create", function(target){
                target.image = "goodImage";
                cameraRender.add(target, 20);
                collisionEngine.addElement(target, "bonus");
                target.collisionCallback["pikachu"] = function(opponent){
                    opponent.speedY = -16;
                }
            });

        /***** On recupere les images du serveur*****/
            eventBus.emit("load images");
            eventBus.on("images loaded", function(images) {
                console.log(images);
                cameraRender.images.goodImage = images["flag_french"];
                cameraRender.images.badImage = images["flag_romanian"];
            });
    }();

    //Initialisation des elements du jeu
    wall.create(1100, 1400, 600, 30, config.wallColor);
    wall.create(1600, 100, 10000, 700, config.wallColor);
    wall.create(850, 0, 60, 1600, config.wallColor);
    wall.create(850, 1600, 20000, 60, config.wallColor);
    element.create(1600, 1350, 50, 50, "bonus");


    cameraRender.backgroundParralax("./images/pikachuParallax.png", 1, 0.5);

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
    eventBus.on("key pressed Z", function(){ 
        game.sounds.jump.play();
        game.pikachu.speedY = -10
          });
    eventBus.on("key pressed Q", function(){
         game.pikachu.canIdle=false;
        game.pikachu.changeAnimation("runRight") 
    });
    eventBus.on("key pressed D", function(){ 
        game.pikachu.canIdle=false;
        game.pikachu.changeAnimation("runLeft") 
    });
    eventBus.on("key pressed S", function(){ 
        game.pikachu.desaccrochage=true;
        game.pikachu.speedY+=5 
    });
    cameraRender.fixedCameraOn(game.pikachu);
    cameraRender.addSprite("pikachu", "./images/pikachu.png", pikaSpriteConfig);
    cameraRender.putSpriteOn(game.pikachu, "pikachu");
    cameraRender.add(game.pikachu, 11);

    var run = function(game){
        requestAnimationFrame(function(){run(game)});
        game.frame++;

       game.pikachu.accrochage=false;
        heroEngine.render();
        game.canvas.context.fillStyle = config.backgroundColor;
        //game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

        gravityEngine.calcul();
        collisionEngine.calcul();
        cameraRender.render();
        cameraRender.showQuadTree();
        if(game.pikachu.speedX==0){
            game.pikachu.canIdle=true;
        }
            if((game.pikachu.currentAnim!="idle"||game.pikachu.currentAnim!="idleRightReverse")&&game.pikachu.canIdle){
                if(game.pikachu.accrochage){
                    game.pikachu.changeAnimation("idleRightReverse");
                }
                else{
                    game.pikachu.changeAnimation("idle");
                }
        }
        if(game.pikachu.accrochage){
             game.pikachu.speedY=-5;
        }
        // wall.render(game.canvas.context);
    };
    requestAnimationFrame(function(){run(game)});
});
