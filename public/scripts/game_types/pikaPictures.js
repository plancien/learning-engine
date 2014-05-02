
define([
    'event_bus',
    'modules/squareHero',
    'modules/collisionEngine',
    'modules/simpleWall',
    'modules/gravityEngine',
    'modules/image_loader',
    'modules/frames',
    'modules/cameraRender',
    'modules/image_loader',
    'modules/simpleElement',
    'game_types/pikaPictures/init',
    'game_types/pikaPictures/level1',
    // 'game_types/pikaPictures/config',
    'game_types/pikaPictures/pikachu'
], function(eventBus, heroEngine, collisionEngine, wall, gravityEngine, frames, Mouse, cameraRender, imageLoader, element, init, level, pikachu) { // init,
    window.cameraRender = cameraRender;
    window.collisionEngine = collisionEngine;
    window.element = element;
    var game = {};

    window.pGame = game;


    collisionEngine.group.pikachu.target.push('wall');

    game.pikachu = pikachu.pikachu;

    init(game);
    level();

    cameraRender.backgroundParralax("./images/pikachuParallax.png", 1, 0.5);

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
    cameraRender.addSprite("pikachu", "./images/green_guy_sprites.png", pikachu.pikaSpriteConfig);
    cameraRender.putSpriteOn(game.pikachu, "pikachu");
    cameraRender.add(game.pikachu, 11);

    var run = function(game){
        requestAnimationFrame(function(){run(game)});
        game.frame++;

       // game.pikachu.accrochage=false;
        heroEngine.calcul();
       //  game.canvas.context.fillStyle = config.backgroundColor;
       //  //game.canvas.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

        gravityEngine.calcul();
        collisionEngine.calcul();
        cameraRender.render();
        cameraRender.showQuadTree();
       //  if(game.pikachu.speedX==0){
       //      game.pikachu.canIdle=true;
       //  }
       //      if((game.pikachu.currentAnim!="idle"||game.pikachu.currentAnim!="idleRightReverse")&&game.pikachu.canIdle){
       //          if(game.pikachu.accrochage){
       //              game.pikachu.changeAnimation("idleRightReverse");
       //          }
       //          else{
       //              game.pikachu.changeAnimation("idle");
       //          }
       //  }
       //  if(game.pikachu.accrochage){
       //       game.pikachu.speedY=-5;
       //  }
       //  // wall.render(game.canvas.context);
    };
    requestAnimationFrame(function(){run(game)});
});
